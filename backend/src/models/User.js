const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@alu\.ufc\.br$/.test(v);
      },
      message: 'Use seu email institucional (@alu.ufc.br)'
    }
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    select: false
  },
  matricula: {
    type: String,
    unique: true,
    sparse: true, // Permite null/undefined duplicados (para staff)
    required: function() {
      return this.role === 'student';
    }
  },
  curso: {
    type: String,
    enum: {
      values: [
        'Engenharia de Software',
        'Ciência da Computação',
        'Engenharia de Produção',
        'Engenharia Mecânica',
        'Engenharia Civil',
        null // Permite null para staff
      ],
      message: 'Curso inválido'
    },
    required: function() {
      return this.role === 'student';
    }
  },
  semestre: {
    type: String
  },
  role: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    default: 'student'
  },
  reputation: {
    type: Number,
    default: 0
  },
  totalReturns: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash da senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar senha
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

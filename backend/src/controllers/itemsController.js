const Item = require('../models/Item');

// @desc    Criar novo item (perdido ou encontrado)
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, inPortaria } = req.body;

    // Validar tipo
    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo inválido. Use "lost" ou "found"'
      });
    }

    // Criar item
    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      inPortaria: inPortaria || false,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      user: req.user.id
    });

    // Popular dados do usuário
    await item.populate('user', 'name email reputation totalReturns');

    res.status(201).json({
      success: true,
      message: 'Item registrado com sucesso',
      data: item
    });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao registrar item',
      error: error.message
    });
  }
};

// @desc    Listar todos os itens encontrados (ativos)
// @route   GET /api/items/found
// @access  Public
exports.getFoundItems = async (req, res) => {
  try {
    const { category, location, search } = req.query;

    let query = { type: 'found', status: 'active' };

    // Filtros
    if (category && category !== 'Todos') {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Item.find(query)
      .populate('user', 'name reputation totalReturns')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar itens',
      error: error.message
    });
  }
};

// @desc    Obter detalhes de um item
// @route   GET /api/items/:id
// @access  Public
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('user', 'name email reputation totalReturns')
      .populate('claimedBy', 'name email');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Erro ao buscar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar item',
      error: error.message
    });
  }
};

// @desc    Reivindicar um item
// @route   POST /api/items/:id/claim
// @access  Private
exports.claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    if (item.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Este item não está mais disponível'
      });
    }

    // Atualizar status
    item.status = 'claimed';
    item.claimedBy = req.user.id;
    item.claimedAt = Date.now();

    await item.save();

    res.json({
      success: true,
      message: 'Item reivindicado com sucesso',
      data: item
    });
  } catch (error) {
    console.error('Erro ao reivindicar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao reivindicar item',
      error: error.message
    });
  }
};

// @desc    Confirmar devolução de item
// @route   POST /api/items/:id/return
// @access  Private
exports.returnItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    // Verificar permissão (dono do item ou quem reivindicou)
    if (item.user.toString() !== req.user.id &&
        (!item.claimedBy || item.claimedBy.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para confirmar esta devolução'
      });
    }

    // Atualizar status
    item.status = 'returned';
    item.returnedAt = Date.now();

    await item.save();

    res.json({
      success: true,
      message: 'Devolução confirmada com sucesso',
      data: item
    });
  } catch (error) {
    console.error('Erro ao confirmar devolução:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao confirmar devolução',
      error: error.message
    });
  }
};

// @desc    Obter itens do usuário
// @route   GET /api/items/my-items
// @access  Private
exports.getMyItems = async (req, res) => {
  try {
    const { type } = req.query;

    let query = { user: req.user.id };

    if (type) {
      query.type = type;
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Erro ao buscar meus itens:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar seus itens',
      error: error.message
    });
  }
};

// @desc    Deletar item
// @route   DELETE /api/items/:id
// @access  Private
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item não encontrado'
      });
    }

    // Verificar se o usuário é o dono do item
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para deletar este item'
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Item removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover item',
      error: error.message
    });
  }
};

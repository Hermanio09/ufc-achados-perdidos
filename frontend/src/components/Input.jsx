const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{color: '#333333'}}>
          {label}
          {required && <span className="ml-1" style={{color: '#DC3545'}}>*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#666666'}}>
            <Icon size={20} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 ${Icon ? 'pl-11' : ''} border rounded-lg focus:outline-none focus:ring-2`}
          style={{
            borderColor: error ? '#DC3545' : '#E0E0E0',
            color: '#333333',
            backgroundColor: 'white'
          }}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm" style={{color: '#DC3545'}}>{error}</p>}
    </div>
  );
};

export default Input;

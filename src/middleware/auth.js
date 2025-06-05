const isAdmin = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  console.log('Received API Key:', apiKey);
  console.log('Expected API Key:', process.env.ADMIN_API_KEY);

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Unauthorized - Invalid API Key'
      }
    });
  }

  next();
};

module.exports = { isAdmin }; 
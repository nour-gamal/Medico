const auth = async (req, res, next) => {
	// const token = req.header("Authorization").split("bearer ")[1];
	// console.log("token", token);
	next();
};

module.exports = auth;

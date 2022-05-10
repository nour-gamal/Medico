const mongoose = require("mongoose");
mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(process.env.PORT, () =>
			console.log(`Server Running on Port: ${PORT}`)
		)
	)
	.catch((error) => console.log(`${error} did not connect`));

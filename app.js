const express = require('express');

const app = express();

// Body Parser
app.use(express.json());
app.use(espress.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

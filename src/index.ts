import http from "node:http"

const PORT = process.env.PORT || 3000;
const server = http.createServer();

server.listen(PORT, () => console.log(`server listening on port ${PORT}`));
server.on("request", (req, res) => {
    res.statusCode = 200
    res.write("I`m a server")
    res.end()
})


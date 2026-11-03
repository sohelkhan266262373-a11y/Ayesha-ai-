const http = require("http");

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "POST" && req.url === "/chat") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", async () => {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/responses",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-4.1-mini",
              input: body
            })
          }
        );

        const data = await response.json();

        res.writeHead(response.ok ? 200 : response.status, {
          "Content-Type": "application/json"
        });

        res.end(JSON.stringify(data));
      } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Server error" }));
      }
    });

    return;
  }

  res.end("Ayesha AI Server is running");
});

server.listen(process.env.PORT || 3000);

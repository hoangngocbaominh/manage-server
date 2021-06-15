const jsonServer = require("json-server");
const queryString = require("query-string");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === "PATCH") {
    req.body.updatedAt = Date.now();
  }
  next();
});
router.render = (req, res) => {
  const TOKEN =
    "72kasOjOOLHBHJbJbjkBuhuOJijOJ2IW1212KSASDNJKLJkj9U9HIRDDEdftghjcrft6yt5r56tyggvtfgy";
  const pathname = req._parsedUrl.pathname;
  const body = req.body;
  const authorization = req.headers.authorization;
  switch (pathname) {
    case "/auth/login":
      if (body.username === "admin" && body.password === "12345")
        res.status(200).jsonp({
          message: "Đăng nhập thành công",
          data: { accessToken: TOKEN },
        });
      else {
        res.status(400).jsonp({ error: "Sai tên đăng nhập hoặc mật khẩu" });
      }
      break;
    default:
      if(authorization === `Bearer ${TOKEN}`){
      const headers = res.getHeaders();
      const totalCountHeader = headers["x-total-count"];
      if (req.method === "GET" && totalCountHeader) {
        const queryParams = queryString.parse(req._parsedUrl.query);
        console.log(queryParams);
        const result = {
          data: res.locals.data,
          pagination: {
            _page: Number.parseInt(queryParams._page || 1),
            _limit: Number.parseInt(queryParams._limit || 10),
            _totalRows: Number.parseInt(totalCountHeader),
          },
        };
        return res.jsonp(result);
      }
      res.jsonp(res.locals.data);
    }else{
      return res.status(401).jsonp({
        error: "Lỗi xác thực"
      })
    }
      break;
  }
};
server.use("/api", router);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("JSON Server is running");
});

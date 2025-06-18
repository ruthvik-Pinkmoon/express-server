app.get("/hello",(req, res) => {
    console.log("Hello From terminal")
    res.send("Hello Inegrated MongoDB")
  })
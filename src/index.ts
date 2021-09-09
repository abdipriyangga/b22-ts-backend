import express from "express";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";

const app = express()

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(morgan("dev"));

app.use('/', router);


app.listen(8080, () => {
  console.log(`App listening port on port 8080`);
  
})
import express from "express";
import cors from "cors";
import routesController from "../adapters/inbound/http/routesController";
import complianceController from "../adapters/inbound/http/complianceController";
import bankingController from "../adapters/inbound/http/bankingController";
import poolsController from "../adapters/inbound/http/poolsController";

const app = express();
app.use(cors({
  origin: "http://localhost:5173" // or your frontend URL
}));

app.use(express.json());

app.get("/", (_, res) => res.send("FuelEU backend running"));

app.use("/routes", routesController);
app.use("/compliance", complianceController);
app.use("/banking", bankingController);
app.use("/pools", poolsController);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => console.log(`✅ Server listening at http://localhost:${PORT}`));

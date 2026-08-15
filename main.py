from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from app.data import ORDERS_DB, SHOES_DB
except ImportError:
    from data import ORDERS_DB, SHOES_DB

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrderStatusResponse(BaseModel):
    order_id: str
    product_name: str
    size: str
    status: str
    carrier: str
    tracking_number: str
    estimated_delivery: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/orders/{order_id}", response_model=OrderStatusResponse)
def get_order(order_id: str):
    for order in ORDERS_DB:
        if order["order_id"] == order_id:
            return order
    raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found")


@app.get("/inventory")
def get_inventory():
    return SHOES_DB

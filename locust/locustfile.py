from locust import HttpUser, task, between
import random

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)
    @task(1)
    def add_new_transaction(self):
        users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        sender, receiver = random.sample(users, 2)
        transaction_data = {
            "user_id": sender,
            "user2_id": receiver,
            "amount": random.randint(50, 150)
        }
        self.client.post("/api/transaction", json=transaction_data)
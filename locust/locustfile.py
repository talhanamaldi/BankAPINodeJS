from locust import HttpUser, task, between
import random

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)
    @task(1)
    def add_new_transaction(self):
        accounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        sender, receiver = random.sample(accounts, 2)
        transaction_data = {
            "sender_account_id": sender,
            "receiver_account_id": receiver,
            "amount": random.randint(50, 200)
        }
        self.client.post("/api/transaction", json=transaction_data)

    @task(2)
    def add_new_account(self):
        users=[1,2,3,4,5,6,7,8,9,10,11,14,15]
        banks=[1,2,3,4,5,6]
        user = random.sample(users)
        bank = random.sample(banks)
        transaction_data = {
            "user_id": user,
            "bank_id": bank,
            "balance": random.randint(100, 5000)
        }
        self.client.post("/api/account", json=transaction_data)
""""
    @task(3)
    def add_new_user(self):
        accounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        sender, receiver = random.sample(accounts, 2)
        transaction_data = {
            "name": sender
        }
        self.client.post("/api/user", json=transaction_data)
    
    @task(4)
    def add_new_bank(self):
        accounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        sender, receiver = random.sample(accounts, 2)
        transaction_data = {
            "sender_account_id": sender,
            "receiver_account_id": receiver,
            "amount": random.randint(50, 200)
        }
        self.client.post("/api/bank", json=transaction_data)   

"""  
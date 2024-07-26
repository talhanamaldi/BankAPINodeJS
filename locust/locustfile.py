from locust import HttpUser, task, between
import random

class WebsiteUser(HttpUser):
    wait_time = between(0,1)
    @task(1)
    def add_new_transaction(self):
        accounts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
        sender, receiver = random.sample(accounts, 2)
        transaction_data = {
            "sender_account_id": sender,
            "receiver_account_id": receiver,
            "amount": random.randint(50, 200)
        }
        self.client.post("/api/transaction", json=transaction_data)

    @task(2)
    def withdraw_from_account(self):
        accounts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
        account_id = random.choice(accounts)
        withdrawal_data = {
            "amount": random.randint(10, 500)
        }
        self.client.put(f"/api/transaction/withdraw/{account_id}", json=withdrawal_data)
        
    @task(3)
    def deposit_to_account(self):
        accounts = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40]
        account_id = random.choice(accounts)
        withdrawal_data = {
            "amount": random.randint(10, 500)
        }
        self.client.put(f"/api/transaction/deposit/{account_id}", json=withdrawal_data)


"""
    @task(2)
    def add_new_account(self):
        users=[1,2,3,4,5,6,7,8,9,10,11,14,15,16,17,18,19]
        banks=[1,2,3,4,5,6,7,8,9,10]
        user = random.choice(users)
        bank = random.choice(banks)
        transaction_data = {
            "user_id": user,
            "bank_id": bank,
            "balance": random.randint(100, 5000)
        }
        self.client.post("/api/account", json=transaction_data)
"""
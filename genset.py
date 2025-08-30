class Genset:
    def __init__(self, maxP):
        self.max_P = maxP
        self.P = 0
        self.state = ""

    
    def start(self):
        self.state = "ON"
    
    def stop(self):
        self.state = "OFF"
    
    def set_P(self, P):
        if P < self.max_P:
            self.P = P
        else:
            self.P = self.max_P
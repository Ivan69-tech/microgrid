import math
class PV:
    def __init__(self, p_max):
        self.P_kw = 0
        self.max_p_kw = p_max
    
    def set_p_kw(self, P):
        if P < 0:
            self.P_kw = 0
        elif P > self.max_p_kw:
            self.P_kw = self.max_p_kw
        else:
            self.P_kw = P

        
    @staticmethod
    def simulate_Pv_prod(max_p_kw, hour):
        """
        Simulate PV production for a specific hour.
        Production follows a simple bell curve to mimic solar insolation.
        """
        angle = math.pi * (hour - 6) / 12 
        if 0 <= hour <= 23:
            p = max(0, max_p_kw * math.sin(angle)) if 0 <= angle <= math.pi else 0
        else:
            p = 0
        return round(abs(p))

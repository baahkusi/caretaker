class Man:
    def __init__(self,woman):
        self.woman = woman
    def decide(self):
        self.ask()
    def decide_first(self):
        print("Man : Ok so I want us to do this and that and this and that ...")
        self.woman.what_do_you_think(False)
    def ask(self):
        self.woman.decide(self)
    def conclude(self):
        print("Man : Ok so let's do this and that and this and that ...")
        self.woman.what_do_you_think(True)

class Woman:
    def decide(self,man):
        print("Woman : Thank you for including me, so what have you already thought of")
        self.ask(man)
    def ask(self,man):
        man.conclude()
    def what_do_you_think(self,man_asked_first):
        if man_asked_first:
            print("Woman : That's my man, we could also do this and that in addition ...\n\nMan's not hot")
        else:
            print("Woman : mmmm I see, Ok if you say so ...\n\nMan's hot")

if __name__ == "__main__":
    man = Man(Woman())
    print("\n\nMan decide by consulting Woman first\n=========================")
    man.decide()
    print("\n\nMan decide before consulting Woman\n==========================")
    man.decide_first()

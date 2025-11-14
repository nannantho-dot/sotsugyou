import tkinter as tk
import random

# --- ゲーム設定 ---
GRID_SIZE = 6        # マス目の数
CELL_SIZE = 60       # マスのサイズ（px）
GAME_TIME = 10       # 制限時間（秒）

class ClickGame:
    def __init__(self, root):
        self.root = root
        self.root.title("クリックゲーム")
        self.create_widgets()
        self.start_game()

    def create_widgets(self):
        self.score = 0
        self.time_left = GAME_TIME
        self.active_cell = None

        # スコアとタイマー表示
        self.label = tk.Label(self.root, text=f"残り時間: {self.time_left}  スコア: {self.score}")
        self.label.pack()

        # マス目のキャンバス
        self.canvas = tk.Canvas(self.root, width=GRID_SIZE*CELL_SIZE, height=GRID_SIZE*CELL_SIZE)
        self.canvas.pack()
        self.canvas.bind("<Button-1>", self.click_cell)

        # リトライボタン（最初は非表示）
        self.retry_button = tk.Button(self.root, text="リトライ", command=self.retry_game)
        self.retry_button.pack()
        self.retry_button.pack_forget()

        # マス目作成
        self.cells = []
        for i in range(GRID_SIZE):
            row = []
            for j in range(GRID_SIZE):
                x1 = j * CELL_SIZE
                y1 = i * CELL_SIZE
                x2 = x1 + CELL_SIZE
                y2 = y1 + CELL_SIZE
                rect = self.canvas.create_rectangle(x1, y1, x2, y2, fill="white", outline="black")
                row.append(rect)
            self.cells.append(row)

    def start_game(self):
        self.score = 0
        self.time_left = GAME_TIME
        self.label.config(text=f"残り時間: {self.time_left}  スコア: {self.score}")
        self.retry_button.pack_forget()
        self.light_random_cell()
        self.update_timer()

    def light_random_cell(self):
        if self.active_cell is not None:
            i, j = self.active_cell
            self.canvas.itemconfig(self.cells[i][j], fill="white")
        i = random.randint(0, GRID_SIZE-1)
        j = random.randint(0, GRID_SIZE-1)
        self.active_cell = (i, j)
        self.canvas.itemconfig(self.cells[i][j], fill="yellow")

    def click_cell(self, event):
        if self.time_left <= 0:
            return
        col = event.x // CELL_SIZE
        row = event.y // CELL_SIZE
        if self.active_cell == (row, col):
            self.score += 1
            self.label.config(text=f"残り時間: {self.time_left}  スコア: {self.score}")
            self.light_random_cell()

    def update_timer(self):
        if self.time_left > 0:
            self.time_left -= 1
            self.label.config(text=f"残り時間: {self.time_left}  スコア: {self.score}")
            self.root.after(1000, self.update_timer)
        else:
            self.label.config(text=f"時間切れ！ 最終スコア: {self.score}")
            if self.active_cell is not None:
                i, j = self.active_cell
                self.canvas.itemconfig(self.cells[i][j], fill="white")
            # リトライボタンを表示
            self.retry_button.pack()

    def retry_game(self):
        self.start_game()


root = tk.Tk()
game = ClickGame(root)
root.mainloop()

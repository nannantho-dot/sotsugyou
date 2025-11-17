import tkinter as tk
import random

GRID_SIZE = 10
CELL_SIZE = 60
GAME_TIME = 10.0  # floatにして小数表示可能に

class ClickGame:
    def __init__(self, root):
        self.root = root
        self.root.title("クリックゲーム")
        self.timer_id = None  # タイマーのafter IDを保持
        self.create_widgets()

    def create_widgets(self):
        self.score = 0
        self.time_left = GAME_TIME
        self.active_cell = None
        self.game_running = False

        self.label = tk.Label(
            self.root,
            text="スタートを押してください",
            font=("Helvetica", 24)
        )
        self.label.pack(pady=10)

        self.canvas = tk.Canvas(
            self.root,
            width=GRID_SIZE * CELL_SIZE,
            height=GRID_SIZE * CELL_SIZE
        )
        self.canvas.pack()
        self.canvas.bind("<Button-1>", self.click_cell)

        button_frame = tk.Frame(self.root)
        button_frame.pack(pady=10)

        self.start_button = tk.Button(
            button_frame,
            text="スタート",
            command=self.start_game,
            font=("Helvetica", 18),
            padx=20,
            pady=10
        )
        self.start_button.pack(side="left", padx=10)

        self.retry_button = tk.Button(
            button_frame,
            text="リセット",
            command=self.retry_game,
            font=("Helvetica", 18),
            padx=20,
            pady=10
        )
        self.retry_button.pack(side="left", padx=10)

        self.cells = []
        for i in range(GRID_SIZE):
            row = []
            for j in range(GRID_SIZE):
                x1 = j * CELL_SIZE
                y1 = i * CELL_SIZE
                x2 = x1 + CELL_SIZE
                y2 = y1 + CELL_SIZE
                rect = self.canvas.create_rectangle(
                    x1, y1, x2, y2, fill="white", outline="black"
                )
                row.append(rect)
            self.cells.append(row)

    # ---------------------
    # ゲーム開始＆カウントダウン
    # ---------------------
    def start_game(self):
        if self.game_running:
            return

        self.game_running = True
        self.score = 0
        self.time_left = GAME_TIME

        self.start_button.config(state=tk.DISABLED)

        self.countdown_number = 3
        self.show_countdown()

    def show_countdown(self):
        # カウントダウン用ラベルを作成
        if not hasattr(self, "count_label"):
            self.count_label = tk.Label(
                self.canvas,
                text="",
                font=("Helvetica", 60, "bold"),
                fg="red",
                bg="white"
            )
            self.count_label.place(
                x=GRID_SIZE*CELL_SIZE//2,
                y=GRID_SIZE*CELL_SIZE//2,
                anchor="center"
            )

        if self.countdown_number > 0:
            self.count_label.config(text=str(self.countdown_number))
            self.countdown_number -= 1
            self.root.after(1000, self.show_countdown)
        else:
            # カウントダウン終了 → ラベルを消す
            self.count_label.destroy()
            del self.count_label

            # ゲーム本編開始
            self.label.config(
                text=f"残り時間: {self.time_left:.2f}  スコア: {self.score}",
                font=("Helvetica", 24)
            )
            self.light_random_cell()
            self.update_timer()

    # ---------------------
    # マスを光らせる
    # ---------------------
    def light_random_cell(self):
        if self.active_cell is not None:
            i, j = self.active_cell
            self.canvas.itemconfig(self.cells[i][j], fill="white")

        i = random.randint(0, GRID_SIZE - 1)
        j = random.randint(0, GRID_SIZE - 1)
        self.active_cell = (i, j)

        color = "red" if self.time_left <= 3.0 else "yellow"
        self.canvas.itemconfig(self.cells[i][j], fill=color)

    # ---------------------
    # マスをクリック
    # ---------------------
    def click_cell(self, event):
        if not self.game_running:
            return

        col = event.x // CELL_SIZE
        row = event.y // CELL_SIZE

        if self.active_cell == (row, col):
            self.score += 1
            self.label.config(
                text=f"残り時間: {self.time_left:.2f}  スコア: {self.score}",
                font=("Helvetica", 24)
            )
            self.light_random_cell()

    # ---------------------
    # タイマー更新
    # ---------------------
    def update_timer(self):
        if self.time_left > 0 and self.game_running:
            self.time_left -= 0.01
            if self.time_left < 0:
                self.time_left = 0

            self.label.config(
                text=f"残り時間: {self.time_left:.2f}  スコア: {self.score}",
                font=("Helvetica", 24)
            )

            # 10msごとに更新しIDを保持
            self.timer_id = self.root.after(10, self.update_timer)
        else:
            self.label.config(
                text=f"時間切れ！ 最終スコア: {self.score}",
                font=("Helvetica", 28, "bold")
            )
            self.game_running = False
            self.start_button.config(state=tk.NORMAL)

            if self.active_cell is not None:
                i, j = self.active_cell
                self.canvas.itemconfig(self.cells[i][j], fill="white")

    # ---------------------
    # リセット
    # ---------------------
    def retry_game(self):
        # タイマーをキャンセル
        if self.timer_id is not None:
            self.root.after_cancel(self.timer_id)
            self.timer_id = None

        for row in self.cells:
            for cell in row:
                self.canvas.itemconfig(cell, fill="white")

        self.active_cell = None
        self.game_running = False
        self.start_button.config(state=tk.NORMAL)

        self.time_left = GAME_TIME  # 時間もリセット

        self.label.config(
            text="スタートを押してください",
            font=("Helvetica", 24)
        )


root = tk.Tk()
game = ClickGame(root)
root.mainloop()

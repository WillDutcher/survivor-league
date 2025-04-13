# Survivor League Web App (2025 Season)

A full-stack web application to manage a custom NFL Survivor League, replacing a legacy Excel-based system with modern automation, real-time updates, and built-in rule enforcement.

---

## 🏆 Game Objective

- This is a last-person-standing game based on the NFL season.
- Each player must pick **one NFL team per week** that they believe will win.
- If the team wins, the player advances.
- If the team loses or ties, the player is at risk of elimination (depending on rebuy rules).

---

## 💰 Entry Options

### Option 1: Basic Entry – $20

- Player is allowed to rebuy if they lose, **up to and including Week 5**.
- Rebuy costs:
  - **Week 1:** $10
  - **Weeks 2–5:** $30
- No rebuys allowed starting Week 6.

### Option 2: Premium Entry – $80

- Player receives **three (3) free rebuys** that may be used **up to and including Week 8**.
- No rebuys are allowed:
  - After **Week 8**, or
  - After using all 3 free rebuys (i.e., 3 losses = elimination)

---

## 🗒️ Weekly Picks

- Each player may only pick **one team per week**, unless forced to pick more due to a tie.
- Once a team is picked, that team is **no longer available** to that player for the rest of the season.
- Players **can submit picks ahead of time** for future weeks and **can edit them at any time** up until kickoff.
- A team **cannot be picked** in a week **if it was already picked before**, or if it is **already picked in a future week**.
- **Deadline:** Picks must be submitted at least **5 minutes before kickoff** of the selected game.

---

## ⚡ Auto-Pick Logic (If Player Misses a Pick)

- If a player fails to submit a pick by **12:59 PM EST Sunday**, the system will:
  1. Look at the teams the player has **not used** yet.
  2. Pick the team with the **highest available spread**.
  3. If multiple teams are tied, the system chooses the **home team** of the **earliest game**, in the order:
    - 1 PM games > 4 PM games > Sunday Night Football > Monday games.

---

## ⚖️ Tie Rules

- If a player picks a team that results in a **tie**, it does **not count as a win**.
- The following week, the player must make **2 correct picks**.
- If either of those tie again, the player must make **2 picks per tie** the following week, and so on.
- **All picks must be correct** for the player to remain in the league.
- Teams used in ties are still considered **used** and cannot be picked again.

---

## ❌ Elimination

A player is eliminated if:

- They lose a game and have no valid rebuys remaining.
- They exceed 3 losses on the $80 entry.
- They attempt to rebuy after Week 5 (for $20 entries) or after Week 8 (for $80 entries).

---

## 🔐 Pick Visibility

- Picks remain **private** until **kickoff** of the selected game.
- Once the game begins, the pick becomes **visible to all other players**.
- Players picking Monday or future-day games will have their picks revealed at kickoff of those games only.
- Players can view **any other player's locked-in picks for past or current weeks**, but never future picks unless the game has already started.
- **Admins** can see all picks at any time.

---

## 💳 Payments

- All entry and rebuy payments must be submitted **before the associated game kicks off**.
- Default payment method is **PayPal**.
- Manual payments (e.g., cash) can be marked as confirmed by the admin.
- Email receipts will be sent upon payment confirmation.

---

## 🤝 Pot Splits

- At the end of any week, if **100% of remaining players agree**, the pot may be split **evenly**.
- If even one player **declines**, play continues.
- If multiple players are alive after **Week 18**, the pot is **split evenly**.

---

## 🌐 Stack Recommendation

### Frontend

- **React + Vite**
- **Tailwind CSS**
- **React Router**

### Backend (Pick One)

- **Option A: Supabase**
  - PostgreSQL, built-in Auth, real-time updates
- **Option B: Node.js + Express + PostgreSQL**
  - Full control and custom logic

### Hosting

- Frontend: **Vercel** or **Netlify**
- Backend: **Render**, **Railway**, or **Supabase**

### Optional APIs

- **NFL Schedule & Scores API** (e.g., SportsDataIO, The Odds API)
  - For live scores, spreads, auto-picks, and result verification

---

## 📂 Spreadsheet Usage

- The original Excel spreadsheet (`2019 Survivor League.xlsm`) is used for:
  - Legacy data reference
  - Testing rebuild accuracy
  - Verifying admin workflows
- **Include it when setting up this project** for dev/debugging purposes.

---

## 🧪 API Endpoints

### `/api/players`

- `GET` – Returns a list of all players
- `POST` – Adds a new player (requires `firstName`, `lastName`, `email`, `password`, and `plan`)
- `PATCH /api/players/:playerId` – Updates a player’s own info (requires authentication)
- `DELETE /api/players/:playerId` – Deletes the player account (must match logged-in user or be admin)

### `/api/picks`

- `GET` – Returns all picks (**admin only**)
- `POST` – Adds a new pick (requires `playerId`, `week`, `team`, optional `type`)
- `GET /api/picks/:playerId` – Returns picks for a specific player (filtered to respect visibility rules)
- `PATCH /api/picks/:pickId` – Updates a pick’s status (e.g., win/loss/tie)
- `DELETE /api/picks/:pickId` – Deletes a pick (authenticated only)

---

## ✅ Pick Object Format

```json
{
  "id": 101,
  "playerId": 1,
  "week": 3,
  "team": "BUF",
  "status": "loss",
  "type": "manual",
  "submittedAt": "2025-09-22T14:33:00Z",
  "result": {
    "winner": "CIN",
    "loser": "BUF",
    "score": "20 - 17"
  }
}

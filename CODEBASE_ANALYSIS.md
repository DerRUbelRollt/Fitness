# FitFlow Fitness Tracking Application - Comprehensive Codebase Analysis

## Executive Summary

FitFlow is a full-stack fitness tracking application built with:
- **Frontend**: React + TypeScript (TanStack Router for routing, React Query for server state)
- **Backend**: .NET 6+ with C# (ASP.NET Core)
- **Database**: MySQL with Entity Framework Core
- **UI Framework**: Tailwind CSS with custom component library
- **State Management**: Custom synchronous service layer with React Context + subscription pattern

---

## 1. CALENDAR FEATURE

### Overview
The calendar provides three view modes (month/week/day) for planning and tracking daily activities.

### Location
- Frontend: [src/routes/calendar.tsx](src/routes/calendar.tsx)
- UI Components: [src/components/activity/](src/components/activity/)

### Key Features

#### 1.1 View Modes
- **Month View**: Grid showing full month with activities displayed as colored tags in each day
- **Week View**: 7-column card layout showing one week at a time
- **Day View**: Detailed list of activities for a single day sorted by start time

#### 1.2 Activity Operations

**Adding Activities:**
- Floating Action Button (FAB) opens `QuickAddDialog`
- Dialog allows selection of preset activities or custom activities
- User inputs: date, time, duration, optional distance/steps
- Calls `addActivity()` from store

**Completing/Deleting Activities:**
- Checkbox icon toggles completion status → calls `toggleActivityComplete(id)`
- Trash icon removes activity → calls `deleteActivity(id)`
- Completed activities show strikethrough and reduced opacity

**Moving Activities:**
- Drag-and-drop between dates in month/week views
- `moveActivity(id, newDate)` updates the date property

#### 1.3 Data Flow
```
QuickAddDialog
  ↓
useStore().addActivity()
  ↓
ActivityService.create()
  ↓
HttpApiClient.write("activities", [...updated list])
  ↓
POST /activities (backend sync)
  ↓
ActivitiesController → ActivityService → Database
```

#### 1.4 Key State Managed
- `activities`: Array of ScheduledActivity objects
- `selectedDate`: Currently selected date for detail view
- `dragId`: Tracks which activity is being dragged
- `view`: Current view mode (month/week/day)
- `cursor`: Reference date for navigation

---

## 2. GOALS SYSTEM

### Overview
Goals allow users to set fitness targets (daily/weekly/monthly) and track progress against completed activities.

### Location
- Frontend: [src/routes/goals.tsx](src/routes/goals.tsx)
- Service: [src/services/GoalService.ts](src/services/GoalService.ts)
- Backend: [Backend/FitnessApi/Services/GoalService.cs](Backend/FitnessApi/Services/GoalService.cs)

### Goal Structure
```typescript
interface Goal {
  id: string;
  title: string;
  target: number;                    // Target value (e.g., 3, 100, 500)
  unit: string;                      // "Minuten", "Schritte", "Liter", "Einheiten"
  period: "day" | "week" | "month";  // Measurement period
  activityFilter?: string;           // Optional: filter by preset or custom activity ID
  createdAt: string;                 // ISO timestamp
}
```

### Key Features

#### 2.1 Goal Creation
- User fills: title, target value, unit, period, optional activity filter
- Form validation ensures title is provided
- Goal stored with creation timestamp
- Calls `addGoal()` → stores in database

#### 2.2 Progress Calculation
**Method**: `GoalService.computeProgress(goal, activities, user?)`

Located in [src/services/GoalService.ts](src/services/GoalService.ts) (lines 33-57):

1. **Determine time window** based on period:
   - `day`: Current calendar day (00:00 - 23:59)
   - `week`: Monday - Sunday (weekStartsOn: 1)
   - `month`: 1st - last day of current month

2. **Filter activities**:
   - Must be in time window
   - Must be `completed: true`
   - If `activityFilter` set, must match `presetId` or `customId`

3. **Calculate progress** by unit:
   - `"Minuten"`: Sum of `durationMin` from filtered activities
   - `"Schritte"`: Sum of `steps` field (only from activities, not manual entries)
   - Other units: Count of activities

#### 2.3 UI Display
- Card-based grid layout (1 col mobile, 2 cols tablet, 3 cols desktop)
- Shows: title, period label, current progress, target, percentage
- Animated progress bar with gradient
- Celebration badge ("🏆 Ziel erreicht!") when target reached (≥100%)
- Delete button (appears on hover)

#### 2.4 Data Persistence
Backend flow:
```
POST /goals (create)
  ↓
GoalsController.Create()
  ↓
IGoalService.CreateAsync()
  ↓
DbContext.Goals.Add() → SaveChangesAsync()
  ↓
MySQL database
```

---

## 3. HABITS TRACKER

### Overview
Habits provide daily tracking for recurring behaviors with streak calculation and 91-day heatmap visualization.

### Location
- Frontend: [src/routes/habits.tsx](src/routes/habits.tsx)
- Service: [src/services/HabitService.ts](src/services/HabitService.ts)
- Backend: [Backend/FitnessApi/Services/HabitService.cs](Backend/FitnessApi/Services/HabitService.cs)

### Habit Structure
```typescript
interface Habit {
  id: string;
  name: string;           // e.g., "2L Wasser", "Meditieren"
  emoji: string;          // Display emoji (e.g., "💧", "💪")
  color: string;          // Hex color
  createdAt: string;      // ISO timestamp
  log: Record<string, boolean>;  // Date → completion map
}
```

### Key Features

#### 3.1 Habit Creation
- Modal form with: name, emoji picker (12 options), color picker (15 colors)
- Creates empty `log: {}`
- Calls `addHabit()` → stored in database

#### 3.2 Streak Calculation
**Algorithm** in `HabitRow` component:

```typescript
// Calculate streak (consecutive days completed up to today)
let streak = 0;
for (let i = 0; i < 365; i++) {
  const d = format(subDays(new Date(), i), "yyyy-MM-dd");
  if (habit.log[d]) streak++;
  else if (i > 0) break;  // Stop at first gap
}
```

- Counts consecutive days backward from today
- Stops when a day without completion is found
- Fire icon (🔥) and color-coded display

#### 3.3 Tracking & Completion
- **Last 7 days** quick buttons: Click to toggle completion
  - Colored background if completed (using habit's color)
  - Dark background if not completed
  - Shows day abbreviation (Mo, Di, Mi, etc.)

- **Toggle action**: `toggleHabit(habitId, dateString)`
  - Sets `log[date] = !log[date]`
  - Updates database synchronously via HttpApiClient

#### 3.4 Analytics
- **30-day completion rate**: `(completed days in last 30) / 30 * 100%`
- **91-day heatmap**: Grid visualization (91 columns, 7 rows)
  - Each cell = 1 day
  - Colored if completed, dark if not
  - Hover shows date and completion status

#### 3.5 Data Persistence
Habit's `log` stored as JSON in MySQL:
- Model: `Dictionary<string, bool>` in C#
- Serialized to JSON string in database
- Custom comparer ensures correct change detection
- See [Backend/FitnessApi/Data/FitnessDbContext.cs](Backend/FitnessApi/Data/FitnessDbContext.cs) (lines 51-62)

---

## 4. STATISTICS PAGE

### Overview
Analytics dashboard with weekly trends, activity distribution, and aggregate metrics.

### Location
- Frontend: [src/routes/stats.tsx](src/routes/stats.tsx)
- Charts: Recharts library (Bar, Pie, Area charts)

### Key Metrics Displayed

#### 4.1 Big Stats (Top 4 Cards)
- **Total Minutes**: Sum of `durationMin` for all completed activities (all time)
- **Sessions**: Count of completed activities (all time)
- **Longest Habit Streak**: Max consecutive days across all habits
- **Habit Days**: Total completion count across all habit logs

#### 4.2 Charts

**1. Weekly Bar Chart**
- 7 bars for Mon-Sun of current week
- Height = training minutes completed that day
- Hover tooltip shows day name + minutes + session count
- Gradient fill (green to cyan)

**2. Activity Distribution (Donut Pie Chart)**
- Top 8 activities by total minutes
- Each slice = one activity type with its preset/custom color
- Legend shows activity names
- Only includes completed activities

**3. Trend Area Chart**
- Last 30 days of training
- X-axis: date (d.M format), every 3rd day labeled
- Y-axis: minutes
- Green gradient fill under the curve
- Shows training volume over time

#### 4.3 Data Computation
All calculations use `useMemo` for performance:
```typescript
// Week data: 7-day aggregation
const weekData = useMemo(() => {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = addDays(start, i);
    const key = format(d, "yyyy-MM-dd");
    const acts = activities.filter((a) => a.date === key && a.completed);
    return {
      day: format(d, "EE", { locale: de }),
      minutes: acts.reduce((s, a) => s + a.durationMin, 0),
      sessions: acts.length,
    };
  });
}, [activities]);
```

---

## 5. OVERALL ARCHITECTURE

### 5.1 System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     React Frontend                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Routes (TanStack Router)                              │  │
│  │  ├─ / (Dashboard)                                      │  │
│  │  ├─ /calendar                                          │  │
│  │  ├─ /goals                                             │  │
│  │  ├─ /habits                                            │  │
│  │  ├─ /stats                                             │  │
│  │  └─ /settings                                          │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Store (React Context + StoreProvider)                 │  │
│  │  ├─ activities, customActivities, goals, habits        │  │
│  │  ├─ user profile (name, streak, steps, etc.)          │  │
│  │  └─ Actions: add/delete/toggle/move operations        │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Service Layer (TypeScript Services)                   │  │
│  │  ├─ ActivityService                                    │  │
│  │  ├─ GoalService (progress calculation)                 │  │
│  │  ├─ HabitService                                       │  │
│  │  ├─ CustomActivityService                              │  │
│  │  ├─ UserService                                        │  │
│  │  └─ PresetService (reads presets.json)                 │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  HttpApiClient (IApiClient Implementation)             │  │
│  │  ├─ In-memory snapshot (SeedSnapshot)                  │  │
│  │  ├─ Subscription pattern for React updates             │  │
│  │  ├─ Optimistic updates                                 │  │
│  │  └─ Background sync with backend                       │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ HTTP (REST)
┌─────────────────────────────────────────────────────────────┐
│                  .NET Backend (ASP.NET Core)                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Controllers (REST Endpoints)                          │  │
│  │  ├─ ActivitiesController (CRUD)                        │  │
│  │  ├─ GoalsController (CRUD)                             │  │
│  │  ├─ HabitsController (CRUD)                            │  │
│  │  ├─ CustomActivitiesController (CRUD)                  │  │
│  │  ├─ UserController (GET/PUT)                           │  │
│  │  └─ Routes: /activities, /goals, /habits, etc.         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                             │  │
│  │  ├─ IActivityService / ActivityService                 │  │
│  │  ├─ IGoalService / GoalService                         │  │
│  │  ├─ IHabitService / HabitService                       │  │
│  │  ├─ ICustomActivityService / CustomActivityService     │  │
│  │  └─ IUserService / UserService                         │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Data Layer (Entity Framework Core)                    │  │
│  │  ├─ FitnessDbContext (DbContext)                       │  │
│  │  ├─ DbSets: Users, ScheduledActivities, Goals, etc.    │  │
│  │  └─ Migrations: 2 applied migrations                   │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ MySQL Protocol
┌─────────────────────────────────────────────────────────────┐
│                     MySQL Database                           │
│  ├─ Users (UserProfile)                                      │
│  ├─ ScheduledActivities                                      │
│  ├─ Goals                                                    │
│  ├─ Habits (log stored as JSON)                              │
│  ├─ CustomActivities                                         │
│  └─ Migrations applied on startup                            │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Frontend Architecture

#### State Management Flow
1. **Service Layer** (TypeScript) - Pure business logic
   - No React dependencies
   - Returns domain types
   - Takes IApiClient as dependency

2. **HTTP Client** - Synchronous interface with async backend
   - Maintains in-memory snapshot
   - Publishes events when data changes
   - Handles optimistic updates
   - Fallback to seed data if backend unavailable

3. **React Store** (Context Provider)
   - Subscribes to HttpApiClient changes
   - Wraps services with React hooks
   - Provides `useStore()` hook to components

4. **Components** - Pure UI + hooks
   - Call `useStore()` for data and actions
   - No direct backend communication
   - Use React Query for server state (initialized but not heavily used)

#### Key Service Files
- [src/services/index.ts](src/services/index.ts) - Composition root, singleton pattern
- [src/services/apiClient.ts](src/services/apiClient.ts) - IApiClient interface, utilities
- [src/services/HttpApiClient.ts](src/services/HttpApiClient.ts) - HTTP implementation (245 lines)
- [src/services/ActivityService.ts](src/services/ActivityService.ts)
- [src/services/GoalService.ts](src/services/GoalService.ts) - Progress calculation
- [src/services/HabitService.ts](src/services/HabitService.ts)
- [src/services/UserService.ts](src/services/UserService.ts) - Streak management
- [src/services/CustomActivityService.ts](src/services/CustomActivityService.ts)
- [src/services/PresetService.ts](src/services/PresetService.ts)

#### Data Models
All shared types in [src/types/domain.ts](src/types/domain.ts):
```typescript
ScheduledActivity, CustomActivity, Goal, Habit, UserProfile, ActivityPresetData
```

### 5.3 Backend Architecture

#### API Contracts
All RESTful endpoints follow standard CRUD pattern:

| Resource | Endpoint | Methods |
|----------|----------|---------|
| Activities | `/activities` | GET (list), POST (create), PUT /{id}, DELETE /{id} |
| Goals | `/goals` | GET (list), POST (create), PUT /{id}, DELETE /{id} |
| Habits | `/habits` | GET (list), POST (create), PUT /{id}, DELETE /{id} |
| Custom Activities | `/custom-activities` | GET (list), POST (create), PUT /{id}, DELETE /{id} |
| User | `/user` | GET, PUT |

#### Models
Located in [Backend/FitnessApi/Models/](Backend/FitnessApi/Models/):

**UserProfile.cs**
```csharp
{
  Id: "user-1",
  Name: string,
  CurrentStreak: int,
  LongestStreak: int,
  LastActivityDate: DateTime?,
  StepsToday: int,
  StepsGoal: int,
  CalorieToday: int,
  CalorieGoal: int,
  MinutesGoal: int
}
```

**ScheduledActivity.cs**
```csharp
{
  Id, PresetId, CustomId, Title, Color, Icon,
  Date: "yyyy-MM-dd",
  StartTime: "HH:mm",
  DurationMin, Completed, Notes,
  Distance (km), Steps
}
```

**Goal.cs**
```csharp
{
  Id, Title, Target, Unit, Period,
  ActivityFilter, CreatedAt
}
```

**Habit.cs**
```csharp
{
  Id, Name, Emoji, Color, CreatedAt,
  Log: Dictionary<string, bool> (JSON serialized)
}
```

#### Database Configuration
[Backend/FitnessApi/Data/FitnessDbContext.cs](Backend/FitnessApi/Data/FitnessDbContext.cs):

- **MySql**: `UseMySql()` with auto-detection
- **Migrations**: Applied on app startup
- **Habit.Log**: Custom JSON serialization with value comparer
- **DateTime Conversion**: UTC conversion for Goal and Habit timestamps

#### Service Layer
Each service implements async interface and handles database operations:

```csharp
public interface IActivityService {
  Task<List<ScheduledActivity>> GetAllAsync();
  Task<ScheduledActivity?> GetByIdAsync(string id);
  Task<ScheduledActivity> CreateAsync(ScheduledActivity activity);
  Task<ScheduledActivity> UpdateAsync(string id, ScheduledActivity activity);
  Task<bool> DeleteAsync(string id);
}
```

#### Dependency Injection
[Backend/FitnessApi/Program.cs](Backend/FitnessApi/Program.cs):
```csharp
builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IGoalService, GoalService>();
builder.Services.AddScoped<IHabitService, HabitService>();
builder.Services.AddScoped<ICustomActivityService, CustomActivityService>();
builder.Services.AddScoped<IUserService, UserService>();
```

### 5.4 Data Synchronization

#### HttpApiClient Sync Strategy
[src/services/HttpApiClient.ts](src/services/HttpApiClient.ts) (lines 105-135):

1. **Optimistic Updates**: Immediately update in-memory state
2. **Background Reconciliation**: Diff previous vs next collections
3. **Smart CRUD**: Only send necessary REST calls (POST for new, PUT for changed, DELETE for removed)
4. **Error Handling**: Log failures, keep optimistic update in place
5. **Fallback**: If backend unreachable at bootstrap, use seed data

Example:
```typescript
write<K extends EntityKey>(key: K, value: SeedSnapshot[K]): void {
  const prev = this.state[key];
  this.state = { ...this.state, [key]: value };  // Optimistic
  this.emit();  // Notify subscribers
  
  if (this.online) {
    void this.sync(key, prev, value);  // Background sync
  }
}
```

---

## 6. USER PROFILE & SETTINGS

### Overview
User profile tracks personal fitness metrics and settings, plus custom activity management.

### Location
- Frontend: [src/routes/settings.tsx](src/routes/settings.tsx)
- Service: [src/services/UserService.ts](src/services/UserService.ts)
- Backend: [Backend/FitnessApi/Services/UserService.cs](Backend/FitnessApi/Services/UserService.cs)

### User Profile Data

#### Profile Fields
```typescript
interface UserProfile {
  name: string;                    // User's display name
  currentStreak?: number;          // Current consecutive activity days
  longestStreak?: number;          // Best streak ever achieved
  lastActivityDate?: string;       // ISO date of last logged activity
  stepsToday?: number;             // Manual steps entry
  stepsGoal?: number;              // Daily target (default 10,000)
  calorieToday?: number;           // Manual calorie entry
  calorieGoal?: number;            // Daily target (default 2,100)
  minutesGoal?: number;            // Daily workout duration target
}
```

### 6.1 Streak Management

**How Streaks Work**:
Located in [src/services/UserService.ts](src/services/UserService.ts) (lines 47-82):

1. When activity is toggled complete for today → `updateStreak(today)` called
2. Check `lastActivityDate`:
   - **Same as today**: No change (already counted)
   - **Yesterday**: Increment streak, update longest if needed
   - **Before yesterday**: Reset streak to 1

3. Update database: current streak, longest streak, last activity date

```typescript
if (lastDate === today) {
  return;  // Already counted today
} else if (lastDate === yesterday) {
  newStreak = (user.currentStreak ?? 0) + 1;  // Continue streak
} else {
  newStreak = 1;  // Reset, but count today
}
```

**Display**: Dashboard shows current streak with Flame icon (🔥)

### 6.2 Settings Page Features

#### Profile Section
- **Name Field**: Text input, updates via `setUserName()`
- Saved to database immediately upon change

#### Custom Activities
Users can create their own activity types:

**Creation Form**:
- Name input (e.g., "Klettern", "Tanzen")
- Color picker (15 preset hex colors)
- Icon picker (16 icons from lucide-react)

**Data Model**:
```typescript
interface CustomActivity {
  id: string;
  label: string;
  color: string;          // Hex color
  iconId: string;         // lucide icon ID
}
```

**Display Grid**:
- Shows created custom activities
- 2 cols on mobile, 3 cols on desktop
- Icon + name + delete button (trash icon)
- Styled with activity's color

**Integration**:
- Custom activities available in QuickAddDialog
- Can be used like presets when scheduling activities
- Stored as separate entity, linked via `customId` on ScheduledActivity

#### Steps & Calories Goals
Frontend hints in dashboard show:
- `stepsToday`: Manual entry + automatic from completed activities
- `stepsGoal`: Configurable target
- `calorieToday`: Manual entry
- `calorieGoal`: Configurable target

### 6.3 Data Persistence

**Frontend Store Methods**:
```typescript
setUserName(name) → services.user.setName(name)
setUserStepsToday(steps) → services.user.setStepsToday(steps)
setUserStepsGoal(steps) → services.user.setStepsGoal(steps)
setUserCalorieToday(cal) → services.user.setCalorieToday(cal)
setUserCalorieGoal(cal) → services.user.setCalorieGoal(cal)
setUserMinutesGoal(min) → services.user.setMinutesGoal(min)
```

**Backend UserService**:
- `GetAsync()`: Fetches or creates singleton user-1
- `UpdateAsync()`: Merges all fields and persists
- Default goals: steps 10k, calories 2100, minutes 60

---

## 7. DASHBOARD & KEY COMPONENTS

### Dashboard (Root Route)
Location: [src/routes/index.tsx](src/routes/index.tsx)

#### Key Sections

**1. Header**
- Time-based greeting ("Guten Morgen", "Hallo", "Guten Abend")
- Username personalization
- Daily motivational quote (rotates by day of week)

**2. Top Metrics (3 Progress Rings)**
```
┌─────────────────────┐
│ Schritte heute      │  (Steps/Goal with ring)
├─────────────────────┤
│ Kalorien            │  (Cal/Goal with ring)
├─────────────────────┤
│ Trainingszeit       │  (Minutes/Goal with ring)
└─────────────────────┘
```

Each ring shows:
- Percentage of daily goal achieved
- Circular progress visualization
- Color-coded (green, blue, purple)

**3. Quick Stats (4 Pills)**
- Einheiten/Woche (completed sessions / total sessions)
- Aktive Tage (days with completed activities this week)
- Wochenminuten (total training minutes this week)
- Habits heute (habits completed today)

**4. Upcoming Activities**
- Next 6 activities sorted by date/time
- Quick overview without full calendar

### Layout Components

**Sidebar** ([src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx)):
- Navigation menu (desktop)
- Links to all main routes: Calendar, Goals, Habits, Stats, Settings
- Active route highlighting

**Bottom Navigation** (mobile):
- 5 tabs for main routes
- Sticky footer on mobile devices

**Floating Action Button** ([src/components/layout/FloatingActionButton.tsx](src/components/layout/FloatingActionButton.tsx)):
- Fixed position (bottom-right)
- Pulse animation
- Opens QuickAddDialog on click
- Always accessible

**PageHeader** ([src/components/layout/PageHeader.tsx](src/components/layout/PageHeader.tsx)):
- Consistent header for each route
- Title, subtitle, optional action button
- Framer Motion animations

---

## 8. KEY TECHNOLOGIES & LIBRARIES

### Frontend

| Library | Purpose | Version |
|---------|---------|---------|
| React | UI framework | 18+ |
| TypeScript | Type safety | |
| TanStack Router | Client routing | Latest |
| React Query | Server state (initialized) | |
| Framer Motion | Animations | |
| date-fns | Date manipulation | |
| Lucide React | Icon library | ~19 icons used |
| Recharts | Data visualization | Bar/Pie/Area charts |
| Tailwind CSS | Styling | |
| Sonner | Toast notifications | |

### Backend

| Technology | Purpose |
|-----------|---------|
| ASP.NET Core | Framework |
| Entity Framework Core | ORM |
| MySQL | Database |
| C# | Language |

### Build & Dev

| Tool | Purpose |
|------|---------|
| Vite | Frontend build tool |
| Bun | Package manager |
| ESBuild | Bundler |

---

## 9. KEY DESIGN PATTERNS

### 1. Service Locator Pattern
- `getServices()` returns singleton Services object
- All services share same IApiClient instance
- Simplifies testing and composition

### 2. Event-Driven Reactivity
- HttpApiClient emits events on data changes
- React components subscribe via `useStore()`
- Decouples services from React

### 3. Optimistic UI
- Update in-memory state immediately
- Sync with backend in background
- Fallback to seed data if offline

### 4. Domain-Driven Design
- Shared domain types (`src/types/domain.ts`)
- Services operate on domain types
- Type safety across boundaries

### 5. Repository Pattern
- Backend services abstract database access
- EntityFramework DbContext is repository
- Controllers use services, not DbContext directly

---

## 10. DATA FLOW EXAMPLES

### Example 1: Complete Activity Flow

```
User clicks activity checkbox
  ↓
toggleActivityComplete(id)
  ↓
ActivityService.toggleComplete(id)
  ↓
Store notifies subscribers (React re-renders)
  ↓ (parallel background)
HttpApiClient reconciles with backend
  ↓
PUT /activities/{id} { completed: true }
  ↓
ActivitiesController.Update()
  ↓
ActivityService.UpdateAsync()
  ↓
DbContext.SaveChangesAsync()
  ↓ (then)
UserService.updateStreak() (if today's activity)
  ↓
PUT /user
  ↓
UserService.UpdateAsync()
  ↓
Database updated, UI shows streak +1
```

### Example 2: Create Goal Flow

```
User fills goal form and submits
  ↓
addGoal(goalInput)
  ↓
GoalService.create(goalInput)
  ↓
IApiClient.write("goals", [...goals, newGoal])
  ↓
Store re-renders goal list
  ↓ (background)
POST /goals { title, target, unit, period, ... }
  ↓
GoalsController.Create()
  ↓
IGoalService.CreateAsync()
  ↓
DbContext.Goals.Add()
  ↓
SaveChangesAsync()
  ↓
Goal stored, id generated, UI updates
```

### Example 3: Habit Tracking Flow

```
User clicks day button on habit
  ↓
toggleHabit(habitId, dateString)
  ↓
HabitService.toggle(habitId, dateString)
  ↓
Updates habit.log[dateString] = !habit.log[dateString]
  ↓
IApiClient.write("habits", [...habits with updated log])
  ↓
Store re-renders, streak recalculated
  ↓ (background)
PUT /habits/{id} { ..., log: { "2025-01-15": true, ... } }
  ↓
HabitsController.Update()
  ↓
IHabitService.UpdateAsync()
  ↓
DbContext.Habits.Update()
  ↓
SaveChangesAsync() (JSON serialization)
  ↓
Database persisted, heatmap updates
```

---

## 11. PERFORMANCE CONSIDERATIONS

### Frontend Optimizations
- **useMemo** for expensive calculations (goal progress, chart data)
- **Layout animations** via Framer Motion (GPU-accelerated)
- **Lazy code splitting** via TanStack Router
- **Service singleton** avoids recreation
- **React Context** for state (not Redux overhead)

### Backend Optimizations
- **Async/await** throughout
- **DbContext caching** (default behavior)
- **ToListAsync()** for database queries
- **Dependency injection** for testability
- **CORS enabled** for frontend communication

### Data Sync Optimization
- **Optimistic updates** reduce perceived latency
- **Background reconciliation** doesn't block UI
- **Diff-based sync** only sends changed entities
- **6-second timeout** on network requests
- **Seed data fallback** for offline support

---

## 12. MIGRATION & DATABASE SETUP

### Applied Migrations
Located in [Backend/FitnessApi/Migrations/](Backend/FitnessApi/Migrations/):

1. **20260603221302_InitialMySqlSetup.cs**
   - Creates all base tables: Users, ScheduledActivities, Goals, Habits, CustomActivities

2. **20260604185349_ConvertDateTimesToStrings.cs**
   - Converts datetime fields to string format (ISO dates)

### Auto-Migration on Startup
[Backend/FitnessApi/Program.cs](Backend/FitnessApi/Program.cs):
```csharp
using (var scope = app.Services.CreateScope()) {
  var db = scope.ServiceProvider.GetRequiredService<FitnessDbContext>();
  await db.Database.MigrateAsync();  // Applies pending migrations
}
```

---

## 13. CONFIGURATION

### Frontend Environment Variables
- `VITE_API_URL`: Backend API base URL (defaults to seed data if empty)

### Backend Configuration
- **appsettings.json**: Production settings
- **appsettings.Development.json**: Development overrides
- **CORS**: AllowedOrigins configured per environment
- **MySQL**: ConnectionString configured via settings

### Preset Activities
Location: [src/data/presets.json](src/data/presets.json)

17 activity presets with:
- ID, label, icon, color, default duration
- Optional: trackDistance (running, cycling, etc.)
- Optional: trackSteps (10k steps activity)

---

## 14. SUMMARY TABLE

| Aspect | Technology | Implementation |
|--------|-----------|-----------------|
| **Routing** | TanStack Router | File-based routes (src/routes/) |
| **State** | React Context | Store with subscription pattern |
| **Services** | TypeScript Classes | Singleton pattern composition root |
| **API Client** | Fetch API | HttpApiClient with optimistic updates |
| **Database** | MySQL + EF Core | Auto-migration on startup |
| **DI Container** | Built-in | ASP.NET Core dependency injection |
| **Validation** | React + Toast | Sonner library |
| **Charts** | Recharts | Bar, Pie, Area charts |
| **Animations** | Framer Motion | Page transitions, component animations |
| **Icons** | Lucide React | ~40 icons, 16 in icon registry |
| **Styling** | Tailwind CSS | Utility-first, dark mode |
| **Dates** | date-fns | Locale-aware (de) formatting |
| **Notifications** | Sonner | Toast on operations |

---

## Conclusion

FitFlow is a well-architected fitness tracking application with:
- **Clean separation** between frontend/backend
- **Type-safe** end-to-end with TypeScript and C#
- **Offline-capable** with optimistic updates and fallback data
- **Responsive design** with progressive enhancement (desktop-first)
- **Real-time analytics** with charts and progress tracking
- **Extensible** activity system (presets + custom)
- **Scalable** service-oriented architecture

The codebase demonstrates solid software engineering practices: SOLID principles, DDD, async patterns, proper error handling, and comprehensive state management.

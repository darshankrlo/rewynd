
# Rewynd — High-Level Design

> Rewynd lets you relive the moments you were once in, with the same people, with the same energy and with a pinch of hovering emotions.

## 1. System Overview

Rewynd is a collaborative memory capsule platform where users create shared capsules, contribute photos, videos, and personal reflections, and lock them for a chosen period.

Once the timer expires, the system processes the collected memories and generates a unique AI-designed experience for that specific group.

The experience can only be revealed when every member is connected and has explicitly unlocked the capsule, allowing the group to relive the memory together.

---

## 2. System Architecture

Rewynd follows a layered architecture in which the frontend handles presentation, while the backend acts as the controlled gateway for all business logic and data access.

### Major Components

- React Frontend
- Backend API
- MongoDB
- Cloudinary
- AI Pipeline
- WebSocket / Real-time Layer
- Redis / Background Job Layer

### High-Level Flow

```text
React Frontend
       |
       | HTTPS / WebSocket
       v
Backend API
       |
       +---- Authentication
       +---- Authorization
       +---- Validation
       +---- Capsule Logic
       +---- Media Handling
       +---- Unlock Logic
       +---- AI Orchestration
       |
       +------------> MongoDB
       |
       +------------> Cloudinary
       |
       +------------> AI Pipeline
       |
       +------------> Redis / Real-time Layer
````

### Architecture Principle

> Frontend presents. Backend decides. Database persists. Cloudinary stores media. AI creates the experience. WebSockets synchronize the moment.

---

## 3. Frontend Architecture

The frontend is responsible for presentation and user interaction.

### Responsibilities

* User authentication UI
* Capsule creation
* Joining capsules using a code
* Media upload interface
* Reflection interface
* Capsule timer
* Capsule status
* Unlock interface
* Real-time member status
* Rewynd reveal experience

The frontend does not directly access protected application data.

All protected operations go through the backend API.

```text
React
  |
  v
Backend API
  |
  v
Protected Data
```

---

## 4. Backend Architecture

The backend acts as the controlled gateway between the frontend and application data.

### Responsibilities

* Authentication
* Authorization
* Request validation
* Capsule business logic
* Membership management
* Media upload handling
* Reflection management
* Capsule locking
* Timer processing
* AI orchestration
* Reveal generation
* Media access control
* Real-time synchronization

The backend is the final authority for all business rules.

---

## 5. Data Architecture

MongoDB is used for application data.

The system contains six core entities:

```text
User
Capsule
CapsuleMember
Reflection
Media
Reveal
```

### Entity Relationships

```text
User 1 -------- * CapsuleMember
Capsule 1 ----- * CapsuleMember

User 1 -------- * Reflection
Capsule 1 ----- * Reflection

User 1 -------- * Media
Capsule 1 ----- * Media

Capsule 1 ----- 1 Reveal
```

### Relationship Diagram

```text
                         USER
                          |
                          | 1 : N
                          v
                  CAPSULE_MEMBER
                          |
                          | N : 1
                          v
                       CAPSULE
                      /   |   \
                     /    |    \
                    /     |     \
                   v      v      v
            REFLECTION  MEDIA   REVEAL
                           |
                           v
                       CLOUDINARY
```

---

## 6. Database Entities

### User

```text
User
├── _id: ObjectId
├── name: String
├── email: String
├── passwordHash: String
├── profileImage: String
├── createdAt: Date
└── updatedAt: Date
```

`email` is unique.

`passwordHash` stores a secure hash rather than a plaintext password.

---

### Capsule

```text
Capsule
├── _id: ObjectId
├── name: String
├── creatorId: ObjectId
├── joinCode: String
├── createdAt: Date
├── unlockAt: Date
└── status: Enum
```

Possible capsule states:

```text
COLLECTING
LOCKED
PROCESSING
READY
UNLOCKING
REVEALED
```

Only the creator can lock the capsule.

The join code is valid only while the capsule is accepting members.

---

### CapsuleMember

```text
CapsuleMember
├── _id: ObjectId
├── capsuleId: ObjectId
├── userId: ObjectId
├── role: Enum
├── unlockConfirmed: Boolean
└── joinedAt: Date
```

Possible roles:

```text
creator
member
```

A compound unique constraint is used:

```text
UNIQUE(capsuleId, userId)
```

This prevents a user from joining the same capsule multiple times.

Live connection status is handled by the real-time presence layer rather than treated as permanent database state.

---

### Reflection

```text
Reflection
├── _id: ObjectId
├── capsuleId: ObjectId
├── userId: ObjectId
├── content: String
├── createdAt: Date
└── updatedAt: Date
```

Each member can create exactly one reflection per capsule.

A compound unique constraint is used:

```text
UNIQUE(capsuleId, userId)
```

Reflections can be edited while the capsule is collecting.

Once the capsule is locked, reflections become immutable.

---

### Media

```text
Media
├── _id: ObjectId
├── capsuleId: ObjectId
├── userId: ObjectId
├── type: Enum
├── storageKey: String
├── metadata: Object
└── createdAt: Date
```

Possible types:

```text
IMAGE
VIDEO
```

MongoDB stores media metadata and the storage reference.

Cloudinary stores the actual image/video files.

Example metadata:

```text
metadata
├── fileSize
├── format
├── width
├── height
└── duration
```

---

### Reveal

```text
Reveal
├── _id: ObjectId
├── capsuleId: ObjectId
├── experiencePlan: Object
├── generatedAt: Date
├── version: String
└── generationMetadata: Object
```

Each capsule has exactly one permanent Reveal.

A unique constraint is used:

```text
UNIQUE(capsuleId)
```

The Reveal stores the AI-generated experience plan rather than the actual media files.

---

## 7. Media Storage Architecture

Actual media is stored externally in Cloudinary.

MongoDB stores the metadata and reference.

```text
User
  |
  v
Backend
  |
  +----> MongoDB
  |        |
  |        └── Media metadata
  |
  └----> Cloudinary
           |
           └── Actual image/video
```

This prevents large media files from being stored directly in MongoDB.

The backend controls access to protected media.

---

## 8. Capsule Lifecycle

The capsule follows the following lifecycle:

```text
CREATED / COLLECTING
        |
        | Creator locks
        v
     LOCKED
        |
        | unlockAt reached
        v
   PROCESSING
        |
        | AI generation complete
        v
      READY
        |
        | Everyone connects
        | Everyone unlocks
        v
    UNLOCKING
        |
        | Countdown
        v
    REVEALED
```

### Collection Phase

Members can:

* Join the capsule
* Upload photos/videos
* Write their reflection
* Edit their reflection

### Lock Phase

Only the creator can lock the capsule.

After locking:

* New members cannot join
* New media cannot be uploaded
* Reflections cannot be edited
* Join code becomes invalid

The collected data becomes effectively immutable.

---

## 9. AI Pipeline

When the timer expires, AI preparation begins.

```text
Photos
Videos
Reflections
    |
    v
Data Retrieval
    |
    v
Embeddings / RAG
    |
    v
Memory Analysis
    |
    v
Creative Direction
    |
    v
Experience Generation
    |
    v
Output Validation
    |
    v
Permanent Reveal
    |
    v
READY
```

The AI does not generate a fixed template for every capsule.

Instead, each capsule receives a unique experience plan based on its own:

* Memories
* Reflections
* Events
* Emotions
* Themes
* Group characteristics

---

## 10. Unique Reveal Architecture

Rewynd does not use one fixed reveal format.

The AI acts as a creative director and determines how a particular capsule should be experienced.

For example, one capsule might become:

```text
Full-screen photo
        ↓
Narration
        ↓
Video
        ↓
Memory collage
        ↓
Personal quote
        ↓
Final letter
```

Another capsule might become:

```text
Digital scrapbook
        ↓
Reflection
        ↓
Photo grid
        ↓
Video montage
        ↓
Timeline
```

The AI chooses from controlled experience primitives rather than generating arbitrary executable frontend code.

The frontend Experience Engine interprets the generated experience plan.

---

## 11. Permanent Reveal

The Reveal is generated once.

```text
Timer expires
      |
      v
AI Processing
      |
      v
Reveal Generated
      |
      v
Stored Permanently
      |
      v
READY
```

The system does not regenerate the experience every time the capsule is opened.

This provides:

* Consistency
* Lower AI cost
* Faster future access
* Reliability
* Preservation of the original experience

---

## 12. Real-Time Architecture

WebSockets are used for the synchronized reveal experience.

The system tracks live member presence.

Example:

```text
Darshan → Connected
Arjun   → Connected
Rahul   → Connected
Rohan   → Disconnected
Kunal   → Connected
```

The reveal cannot begin until every member is connected.

Each member must also explicitly confirm the unlock.

```text
ALL MEMBERS CONNECTED
        +
ALL MEMBERS UNLOCKED
        +
REVEAL READY
        |
        v
    START REVEAL
```

The backend broadcasts the reveal start event to all connected members.

---

## 13. Synchronized Unlock

The unlock process is controlled entirely by the backend.

```text
Member connects
      |
      v
Clicks Unlock
      |
      v
Backend records confirmation
      |
      v
Check all members
      |
      +---- NO ----> Wait
      |
      YES
      |
      v
REVEAL_STARTED
      |
      v
3... 2... 1...
      |
      v
REWYND
```

If a member disconnects before the reveal begins, the reveal remains blocked until the required connection condition is restored.

---

## 14. Security Architecture

### Authentication

Users authenticate through the backend.

Passwords are securely hashed and never stored as plaintext.

JWTs are used to identify authenticated users.

### Authorization

The backend verifies whether an authenticated user is allowed to perform an operation.

Example:

```text
Authenticated user
       |
       v
Is user the capsule creator?
       |
   YES | NO
       |  \
       v   v
    Allow  Reject
```

Only the creator can lock a capsule.

### Request Validation

The backend validates:

* Request body
* User permissions
* Capsule state
* Membership
* Uploaded files
* Sensitive parameters

The frontend is never treated as a trusted source.

### Rate Limiting

Sensitive endpoints such as:

* Login
* Capsule joining
* Media uploads
* Unlock actions
* AI-related endpoints

should be protected with rate limiting.

---

## 15. Core Architectural Principles

### Backend as the Source of Truth

Frontend restrictions alone are never considered security.

### Separation of Storage

MongoDB stores application data and metadata.

Cloudinary stores actual media.

### Separation of AI and UI

AI generates a validated experience plan.

The frontend Experience Engine renders that plan.

### Immutable Memories

Once a capsule is locked, its contributed memories cannot be modified.

### One Permanent Reveal

Each capsule receives one AI-generated Reveal that remains stored permanently.

### Group Synchronization

The Reveal only begins when every required member is connected and has confirmed the unlock.

---

## 16. Technology Responsibilities

| Technology        | Responsibility                            |
| ----------------- | ----------------------------------------- |
| React + Vite      | Frontend                                  |
| Node.js + Express | Backend API                               |
| MongoDB           | Application database                      |
| Cloudinary        | Image/video storage                       |
| WebSockets        | Real-time communication                   |
| Redis             | Presence / background job infrastructure  |
| AI Provider       | Memory analysis and experience generation |
| JWT               | Authentication                            |
| Password hashing  | Secure credential storage                 |
| Vercel            | Frontend deployment                       |

---

## 17. End-to-End Architecture

```text
                         USERS
                           |
                           v
                    REACT FRONTEND
                           |
                  HTTPS / WebSocket
                           |
                           v
                    BACKEND API
                           |
        ┌──────────────────┼──────────────────┐
        |                  |                  |
        v                  v                  v
    MongoDB            Cloudinary          AI Pipeline
        |                  |                  |
        |                  |          ┌───────┴───────┐
        |                  |          |               |
        |                  |         RAG          AI Agent
        |                  |          |               |
        |                  |          └───────┬───────┘
        |                  |                  |
        |                  |                  v
        |                  |           Experience Plan
        |                  |                  |
        |                  |                  v
        |                  |              Reveal
        |                  |                  |
        └──────────────────┼──────────────────┘
                           |
                           v
                  REAL-TIME UNLOCK
                           |
                           v
                    REWYND EXPERIENCE
```

---

## 18. Final System Flow

```text
CREATE
  ↓
COLLECT
  ↓
LOCK
  ↓
WAIT
  ↓
AI PROCESSING
  ↓
REVEAL READY
  ↓
EVERYONE CONNECTS
  ↓
EVERYONE UNLOCKS
  ↓
3... 2... 1...
  ↓
UNIQUE REWYND EXPERIENCE
```

---

# Architectural Goal

Rewynd is designed not simply as a storage system for old photos, but as a system that transforms a group's collected memories into a **unique, synchronized experience designed specifically for that group**.

The architecture therefore prioritizes:

* Security
* Data integrity
* Controlled media access
* Asynchronous AI processing
* Real-time synchronization
* Personalized AI-generated experiences
* Permanent preservation of the generated Reveal


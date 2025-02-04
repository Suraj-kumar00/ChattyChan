<div align="center">
<h1>ChattyChan </h1>
</div>

**ChattyChan a `real-time`, `scalable` chat application** enabling users to send and receive messages instantly using modern full-stack technologies. Implemented **cloud-native DevOps practices** for `seamless deployment`,` CI/CD automation`, and `high availability` with load balancing.

<div align="center">

  <img src="frontend/public/chattychan.svg" alt="chattychan" width="300" height="300" style="border-radius: 20px;">
</div>

## **Build With** 🛠️

1. **`Frontend:`** React.js (with [**Socket.io**](http://socket.io/) for real-time communication)
2. **`Backend:`** Node.js + Express.js (RESTful API & Socket.io integration)
3. **`Database:`** PostgreSQL (relational structure) + Prisma ORM (type-safe queries)
4. **`Backend-as-a-Service:`** Supabase (real-time database & authentication)

## **Cloud/DevOps Practices** ☁️

1. **`Git`** for version control
2. **`Docker`** for containerized microservices architecture
3. **`GitHub Actions`** CI/CD pipelines for pushing building and pushing the docker images to dockerhub
4. **`Jenkins`** CI/CD pipline for deployment.
5. **`AWS`** Cloud Platform
6. **`Terraform`** (IaC) for provisioning cloud resources on **AWS**
7. **`Kubernetes`** (EKS) for orchestration and auto-scaling
8. **`Prometheus`** + **`Grafana`** (monitoring, alerting, and dashboard visualization)

---

## **Installation on Local Machine**

### **How to run the Frontend**

Navigate to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the frontend server

```bash
npm run dev
```

> The Frontend is build with Vite so it'll run on [http://localhost:5173](http://localhost:5173)

### **How to run the Backend**

Navigate to backend

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Run the backend server

```bash
npm run dev
```

> The Backend will run on [http://localhost:5001](http://localhost:5001)

---

## **Installation Using Docker** 🐳

**Install the Docker Desktop in your local machine**

> Because we need Docker Engine/Daemon to run the docker containers

After `cloning` the repository, open the terminal in the root directory(which is chattychatn) and run the below command:

```bash
docker compose up --build
```

## **Contributing** 🤝

Open to collaborations! Check out our [Contributing Guidelines](./CONTRIBUTING.MD) to get started.

## **License** 📜

MIT Licensed. See [LICENSE](./LICENSE) for details.

⭐ **Star the Repo!** ⭐

**Love this project?** Show your support by starring the repository it helps the community discover this tool!

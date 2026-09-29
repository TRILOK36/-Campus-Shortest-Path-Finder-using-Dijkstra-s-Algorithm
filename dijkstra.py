import heapq

CAMPUS = {
    "Main Gate":     {"Admin Block": 120, "Library": 150, "Parking": 90},
    "Admin Block":   {"Main Gate": 120, "SOCSE Block": 160, "Library": 110},
    "SOCSE Block":   {"Admin Block": 160, "Canteen": 130, "Auditorium": 110},
    "Auditorium":    {"SOCSE Block": 110, "Sports Ground": 150},
    "Sports Ground": {"Canteen": 190, "Auditorium": 150, "Hostel": 140},
    "Library":       {"Main Gate": 150, "Admin Block": 110, "Canteen": 140, "Workshop": 170},
    "Canteen":       {"Library": 140, "SOCSE Block": 130, "Workshop": 100, "Sports Ground": 190, "Hostel": 180},
    "Parking":       {"Main Gate": 90, "Workshop": 200},
    "Workshop":      {"Library": 170, "Parking": 200, "Canteen": 100, "Hostel": 210},
    "Hostel":        {"Sports Ground": 140, "Workshop": 210, "Canteen": 180},
}

def dijkstra(graph, source, target):
    dist = {n: float("inf") for n in graph}
    prev = {}
    dist[source] = 0
    heap = [(0, source)]
    settled = set()
    while heap:
        d, u = heapq.heappop(heap)
        if u in settled:
            continue
        settled.add(u)
        if u == target:
            break
        for v, w in graph[u].items():
            if d + w < dist[v]:
                dist[v] = d + w
                prev[v] = u
                heapq.heappush(heap, (dist[v], v))
    if dist[target] == float("inf"):
        return None, float("inf")
    path, node = [], target
    while node != source:
        path.append(node)
        node = prev[node]
    path.append(source)
    return path[::-1], dist[target]

if __name__ == "__main__":
    for s, t in [("Main Gate", "Hostel"), ("Parking", "Auditorium"), ("Library", "Sports Ground")]:
        p, d = dijkstra(CAMPUS, s, t)
        print(f"{s} -> {t}: {' -> '.join(p)} ({d} m)")

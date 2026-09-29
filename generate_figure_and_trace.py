import json, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from dijkstra import CAMPUS, dijkstra
pos={"Main Gate":(60,190),"Admin Block":(190,100),"SOCSE Block":(340,80),"Auditorium":(450,40),"Sports Ground":(550,150),
"Library":(180,270),"Canteen":(350,200),"Parking":(80,330),"Workshop":(340,320),"Hostel":(520,300)}
path,_=dijkstra(CAMPUS,"Main Gate","Hostel")
pe={frozenset(x) for x in zip(path,path[1:])}
fig,ax=plt.subplots(figsize=(9,5.6))
seen=set()
for u,nb in CAMPUS.items():
    for v,w in nb.items():
        k=frozenset((u,v))
        if k in seen: continue
        seen.add(k)
        (x1,y1),(x2,y2)=pos[u],pos[v]
        on=k in pe
        ax.plot([x1,x2],[-y1,-y2],color="#ED1C24" if on else "#9a948b",lw=4 if on else 1.6,zorder=1)
        ax.text((x1+x2)/2,-(y1+y2)/2+8,str(w),ha="center",fontsize=9,color="#333",bbox=dict(fc="white",ec="none",pad=1),zorder=3)
for n,(x,y) in pos.items():
    on=n in path
    ax.scatter([x],[-y],s=260,color="#ED1C24" if on else "#D9AE5C",ec="black",zorder=2)
    ax.text(x,-y-26,n,ha="center",fontsize=10,fontweight="bold")
ax.set_title("Campus graph (edge weights in metres) - shortest path Main Gate to Hostel in red",fontsize=10)
ax.axis("off"); ax.set_xlim(20,600); ax.set_ylim(-370,-10)
plt.tight_layout(); plt.savefig("campus_graph.png",dpi=170)

# trace
import heapq
g=CAMPUS; src="Main Gate"; tgt="Hostel"
dist={n:float("inf") for n in g}; dist[src]=0; prev={}; done=[]; rows=[]
while True:
    c=[n for n in g if n not in done and dist[n]<float("inf")]
    if not c: break
    u=min(c,key=lambda n:dist[n]); done.append(u); upd=[]
    for v,w in g[u].items():
        if v not in done and dist[u]+w<dist[v]:
            dist[v]=dist[u]+w; prev[v]=u; upd.append(f"{v} = {dist[v]}")
    rows.append([str(len(done)),u,str(dist[u]),"; ".join(upd) or "none"])
    if u==tgt: break
json.dump(rows,open("trace.json","w"))
for r in rows: print(r)

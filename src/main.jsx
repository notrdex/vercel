import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Terminal, Server, Cpu, HardDrive, Activity, Plus,
  Power, RefreshCw, Settings, LogOut, Box
} from "lucide-react";
import "./style.css";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [vms, setVms] = useState([
    { id: "demo-ubuntu", name: "Ubuntu", status: "stopped", cpu: 1, ram: 1024, disk: 10 }
  ]);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  async function api(path, options={}) {
    if (!API_URL) return null;
    const res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function power(vm, action) {
    setLoading(true);
    try {
      const data = await api(`/api/vms/${vm.id}/${action}`, { method: "POST" });
      if (data?.vm) {
        setVms(x => x.map(v => v.id === vm.id ? data.vm : v));
      } else {
        setVms(x => x.map(v => v.id === vm.id ? {
          ...v, status: action === "start" ? "running" : "stopped"
        } : v));
      }
    } catch {
      setVms(x => x.map(v => v.id === vm.id ? {
        ...v, status: action === "start" ? "running" : "stopped"
      } : v));
    } finally { setLoading(false); }
  }

  function createDemo() {
    const id = `ubuntu-${Date.now().toString().slice(-5)}`;
    setVms(x => [...x, { id, name: "Ubuntu", status: "stopped", cpu: 1, ram: 1024, disk: 10 }]);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="logo">Z</div><span>ZepVm</span></div>
        <div className="nav">
          <button className={tab==="overview"?"active":""} onClick={()=>setTab("overview")}><Activity/> Overview</button>
          <button className={tab==="terminal"?"active":""} onClick={()=>setTab("terminal")}><Terminal/> Terminal</button>
          <button><Server/> Servers</button>
          <button><Settings/> Settings</button>
        </div>
        <div className="side-bottom">
          <div className="host"><span className="dot"></span><div><b>Host</b><small>Waiting for LXD backend</small></div></div>
          <button><LogOut/> Logout</button>
        </div>
      </aside>

      <main>
        <header>
          <div><h1>{tab === "terminal" ? "Terminal" : "Dashboard"}</h1><p>ZepVm • Ubuntu container manager</p></div>
          <button className="create" onClick={createDemo}><Plus/> New VM</button>
        </header>

        {tab === "terminal" ? (
          <section className="terminal">
            <div className="term-head"><span>root@ubuntu</span><span className="muted">/bin/bash</span></div>
            <div className="term-body">
              <div>Welcome to <b>ZepVm</b>.</div>
              <div className="muted">Connect this panel to your LXD backend to enable a real root shell.</div>
              <div className="prompt">root@ubuntu:~# <span className="cursor"></span></div>
            </div>
          </section>
        ) : (
          <>
            <div className="stats">
              <Stat icon={<Server/>} label="Containers" value={vms.length}/>
              <Stat icon={<Cpu/>} label="CPU" value={`${vms.reduce((a,v)=>a+v.cpu,0)} vCPU`}/>
              <Stat icon={<HardDrive/>} label="Storage" value={`${vms.reduce((a,v)=>a+v.disk,0)} GB`}/>
              <Stat icon={<Activity/>} label="Backend" value={API_URL ? "Connected" : "Not linked"}/>
            </div>

            <section className="section-head"><div><h2>Your VMs</h2><p>Manage your Ubuntu containers</p></div></section>

            <div className="grid">
              {vms.map(vm => (
                <article className="card" key={vm.id}>
                  <div className="card-top">
                    <div className="vm-icon"><Box/></div>
                    <span className={vm.status==="running"?"status running":"status"}>{vm.status}</span>
                  </div>
                  <h3>{vm.name}</h3>
                  <small>{vm.id}</small>
                  <div className="specs">
                    <span><Cpu/> {vm.cpu} vCPU</span>
                    <span><Activity/> {vm.ram} MB</span>
                    <span><HardDrive/> {vm.disk} GB</span>
                  </div>
                  <div className="actions">
                    {vm.status !== "running"
                      ? <button onClick={()=>power(vm,"start")} disabled={loading}><Power/> Start</button>
                      : <button onClick={()=>power(vm,"stop")} disabled={loading}><Power/> Stop</button>}
                    <button className="ghost" onClick={()=>{setSelected(vm);setTab("terminal")}}><Terminal/> Console</button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Stat({icon,label,value}) {
  return <div className="stat"><div className="stat-icon">{icon}</div><div><small>{label}</small><b>{value}</b></div></div>;
}

createRoot(document.getElementById("root")).render(<App />);
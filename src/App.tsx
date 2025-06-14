import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import { createLightNode, createEncoder, utf8ToBytes, LightNode } from "@waku/sdk";
import "./App.css";

const DEFAULT_CONTENT_TOPIC = "/js-waku-examples/1/message-ratio/utf8";

const encoder = createEncoder({
  contentTopic: DEFAULT_CONTENT_TOPIC,
  pubsubTopicShardInfo: {
      clusterId: 42,
      shard: 0,
  }
});

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [node, setNode] = useState<LightNode>();

  useEffect(() => {
    async function run() {
      if (node) return;

      const n = await createLightNode({
        defaultBootstrap: false,
        networkConfig: {
            clusterId: 42,
            shards: [0]
        },
        numPeersToUse: 2,
      });

      await Promise.allSettled([
          n.dial("/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ"),
          n.dial("/dns4/vps-aaa00d52.vps.ovh.ca/tcp/8000/wss/p2p/16Uiu2HAm9PftGgHZwWE3wzdMde4m3kT2eYJFXLZfGoSED3gysofk")
      ]);

      await n.start();
      await n.waitForPeers();

      setNode(n);

      // const decoder = createDecoder(DEFAULT_CONTENT_TOPIC, { clusterId: 42, shard: 0 });
    }

    run();
  }, [node, setNode]);

  async function greet() {
    const r = await node?.lightPush.send(encoder, { payload: utf8ToBytes("hello") })
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(`${name}:\tsuccess:${r?.successes.toString()}\telse:${r?.failures.map(v=>v.error.toString()).toString()}`);
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </main>
  );
}

export default App;

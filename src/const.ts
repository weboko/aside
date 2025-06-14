export const CONTENT_TOPIC = "/aside/1/chat/proto";

// CLUSTER STATUS
// export const BOOTSTRAP_PEERS = [
//   "/dns4/boot-01.do-ams3.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAmAR24Mbb6VuzoyUiGx42UenDkshENVDj4qnmmbabLvo31",
//   "/dns4/boot-01.gc-us-central1-a.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAm8mUZ18tBWPXDQsaF7PbCKYA35z7WB2xNZH2EVq1qS8LJ",
//   "/dns4/boot-01.ac-cn-hongkong-c.status.prod.status.im/tcp/443/wss/p2p/16Uiu2HAmGwcE8v7gmJNEWFtZtojYpPMTHy2jBLL6xRk33qgDxFWX",
// ];

// export const CLUSTER_ID = 16;
// export const SHARD_ID = 32;
// export const PUBSUB_TOPIC = `/waku/2/rs/${CLUSTER_ID}/${SHARD_ID}`;

// CLUSTER 42
export const BOOTSTRAP_PEERS = [
  "/dns4/waku-test.bloxy.one/tcp/8095/wss/p2p/16Uiu2HAmSZbDB7CusdRhgkD81VssRjQV5ZH13FbzCGcdnbbh6VwZ",
  "/dns4/vps-aaa00d52.vps.ovh.ca/tcp/8000/wss/p2p/16Uiu2HAm9PftGgHZwWE3wzdMde4m3kT2eYJFXLZfGoSED3gysofk",
];
export const CLUSTER_ID = 42;
export const SHARD_ID = 0;
export const PUBSUB_TOPIC = `/waku/2/rs/${CLUSTER_ID}/${SHARD_ID}`;

import { createLightNode, Protocols } from "@waku/sdk";
import type { LightNode } from "@waku/interfaces";
import { HealthStatusChangeEvents, HealthStatus } from "@waku/interfaces";

import { BOOTSTRAP_PEERS, CLUSTER_ID, SHARD_ID } from "../const";

export interface IWaku {
  stop(): Promise<void>;
}

export class Waku implements IWaku {
  private static instance: Waku;

  // needed to cover case when Client.create run multiple times
  private static promise: Promise<Waku>;

  public static async create(): Promise<Waku> {
    const run = async (): Promise<Waku> => {
      let node: LightNode | undefined = undefined;

      try {
        node = await createLightNode({
          defaultBootstrap: false,
          networkConfig: {
            clusterId: CLUSTER_ID,
            shards: [SHARD_ID]
          },
          bootstrapPeers: BOOTSTRAP_PEERS,
          discovery: {
            dns: false,
            peerExchange: true,
            localPeerCache: true,
          },
        });

        // expose for debugging purposes
        (window as any)["waku"] = node;

        await node.waitForPeers(
          [Protocols.Filter, Protocols.LightPush],
          60 * 1000 // one minute
        );
      } catch(e) {
        console.error("Failed to create Waku instance:", e);
        throw e;
      }

      Waku.instance = new Waku(node);
      return Waku.instance;
    };

    if (!Waku.promise) {
      Waku.promise = run();
    }

    return Waku.promise;
  }

  public readonly node: LightNode;

  public constructor(node: LightNode) {
    this.node = node;
    this.node.health.addEventListener(HealthStatusChangeEvents.StatusChange, this.onHealthDrop.bind(this));
  }

  public async stop(): Promise<void> {
    this.node.nextFilter.unsubscribeAll();
    await this.node.stop();
  }

  private async onHealthDrop(e: CustomEvent<HealthStatus>): Promise<void> {
    const status = e.detail;

    if (status !== HealthStatus.Unhealthy) {
      return;
    }

    await Promise.all(
      BOOTSTRAP_PEERS.map(addr => this.node.dial(addr))
    );
  }
}
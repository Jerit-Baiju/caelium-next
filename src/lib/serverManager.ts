interface Server {
  id: number;
  name: string;
  base_url: string;
  weight: number;
  created_at: string;
  total_space: number;
  active_status: boolean;
  release_update_status: boolean;
  last_updated_at: string;
}

class ServerManager {
  private servers: Server[] = [];
  private lastFetchTime: number = 0;
  private fetchInterval: number = 10 * 60 * 1000; // 10 minutes in milliseconds
  private isFetching: boolean = false;
  private serverListUrl: string = `${process.env.NEXT_PUBLIC_API_HOST}/api/core/servers/`;

  /**
   * Fetches the list of servers from the API
   */
  private async fetchServers(): Promise<Server[]> {
    try {
      const response = await fetch(this.serverListUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch servers: ${response.statusText}`);
      }
      const servers: Server[] = await response.json();
      return servers;
    } catch (error) {
      console.error('Error fetching server list:', error);
      // Return cached servers if fetch fails
      return this.servers;
    }
  }

  /**
   * Gets the server list, fetching from API if cache is expired
   */
  async getServers(): Promise<Server[]> {
    const now = Date.now();
    const shouldRefetch = now - this.lastFetchTime > this.fetchInterval;

    if ((shouldRefetch || this.servers.length === 0) && !this.isFetching) {
      this.isFetching = true;
      try {
        const freshServers = await this.fetchServers();
        if (freshServers.length > 0) {
          this.servers = freshServers;
          this.lastFetchTime = now;
        }
      } finally {
        this.isFetching = false;
      }
    }

    return this.servers;
  }

  /**
   * Selects a server based on weight and active status using weighted random selection
   */
  async selectServer(): Promise<Server | null> {
    const servers = await this.getServers();

    // Filter only active servers
    const activeServers = servers.filter((server) => server.active_status);

    if (activeServers.length === 0) {
      console.error('No active servers available');
      return null;
    }

    // Calculate total weight
    const totalWeight = activeServers.reduce((sum, server) => sum + server.weight, 0);

    // Generate random number between 0 and total weight
    const randomValue = Math.random() * totalWeight;

    // Select server based on weighted random selection
    let cumulativeWeight = 0;
    for (const server of activeServers) {
      cumulativeWeight += server.weight;
      if (randomValue <= cumulativeWeight) {
        return server;
      }
    }

    // Fallback to first active server (should not reach here)
    return activeServers[0];
  }

  /**
   * Reports a server error to the public error handler
   */
  async reportServerError(serverId: number): Promise<void> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/core/public_server_error_handler/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ server_id: serverId }),
      });

      if (!response.ok) {
        console.error(`Failed to report server error for server ${serverId}`);
      } else {
        console.log(`Successfully reported error for server ${serverId}`);
        // Force refresh server list after reporting error
        this.lastFetchTime = 0;
      }
    } catch (error) {
      console.error('Error reporting server error:', error);
    }
  }

  /**
   * Forces a refresh of the server list
   */
  async forceRefresh(): Promise<void> {
    this.lastFetchTime = 0;
    await this.getServers();
  }

  /**
   * Gets a specific server by ID
   */
  async getServerById(id: number): Promise<Server | undefined> {
    const servers = await this.getServers();
    return servers.find((server) => server.id === id);
  }
}

// Export singleton instance
export const serverManager = new ServerManager();
export type { Server };

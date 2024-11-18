import ITool, { IToolPort } from "../interfaces/ITool";
import { Repository } from "./Repository";

export class ToolPortsRepository extends Repository<IToolPort> {
  public async updateInTool(port: IToolPort, tool: ITool): Promise<IToolPort> {
    const updatedPort: IToolPort = await api_put(`/tools/ports/${port.id}`, { ...port, tool_id: tool.id });
    const index: number = tool.ports.findIndex((e: IToolPort) => e.id === port.id);
    if (index > -1) tool.ports[index] = updatedPort;
    return updatedPort;
  }
}
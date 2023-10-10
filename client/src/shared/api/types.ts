export interface OSMElement {
  id: number,
  uid: number,
  nodes: number[],
  center: { lon: number, lat: number },
  tags?: Record<string, string>,
  type: string,
  user: string,
}

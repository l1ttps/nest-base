export default function keyLogout(jti: string) {
  return `user:logout:${jti}`;
}

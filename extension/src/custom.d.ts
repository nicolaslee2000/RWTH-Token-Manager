declare module "*.png";
declare module "*.svg";
declare module "*.gif";
declare module "*.module.css" {
  const content: Record<string, string>;
  export default content;
}

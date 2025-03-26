import * as fs from "fs";
import handlebars from "handlebars";
import { join } from "path";

export function loadTemplate(fileName: string) {
  handlebars.registerPartial("header", "");
  const filePath = join(__dirname, "../views", fileName);
  const files = fs.readFileSync(filePath);
  return handlebars.compile(Buffer.from(files).toString());
}

/**
 * Loads a Handlebars template from the specified component file and renders it with the provided parameters.
 *
 * @param {string} componentName - The name of the component file (without extension). in folder views/component/
 * @param {object | any} params - The parameters to be passed to the template.
 * @return {Promise<string>} - A promise that resolves to the rendered template as a string.
 */
export function Component(componentName: string, params: object | any) {
  return loadTemplate(`components/${componentName}.hbs`)({
    ...params,
  });
}

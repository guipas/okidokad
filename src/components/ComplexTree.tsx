import { observer } from "mobx-react-lite";
import { treeStore } from "../tree";

export const ComplexTree = observer(() => {
  console.log(treeStore.asComplexTree(treeStore.root));

  return null;
});

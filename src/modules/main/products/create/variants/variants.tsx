"use client";
import VariantsAddOptions from "./variants-add-options";
import ProductVariants from "./product-variants";

export type ProductOption = {
  _id: string;
  title: string;
  sku: string;
  values: string[];
};

interface VariantsProps {
  productOptions: ProductOption[];
  setProductOptions: React.Dispatch<React.SetStateAction<ProductOption[]>>;
  hasVariant: boolean;
}

const Variants = ({
  productOptions,
  setProductOptions,
  hasVariant,
}: VariantsProps) => {
  // const [inputs, setInputs] = useState<Record<string, string>>({});
  // const inputsRef = useRef(inputs);
  // // console.log(productOptions);
  // // Variant selection and ordering
  // const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  // const [variantOrder, setVariantOrder] = useState<string[]>([]);
  // // console.log(selectedKeys)
  // // console.log(variantOrder)
  // // Update ref on every render
  // useEffect(() => {
  //   inputsRef.current = inputs;
  // }, [inputs]);

  // // Reorder hooks - ALWAYS CALL THESE
  // const {
  //   onDragStart: onOptionDragStart,
  //   onDragOver: onOptionDragOver,
  //   onDrop: onOptionDrop,
  // } = useReorder(setProductOptions);

  // const {
  //   onDragStart: onVariantDragStart,
  //   onDragOver: onVariantDragOver,
  //   onDrop: onVariantDrop,
  // } = useStringReorder(setVariantOrder);

  // // Memoized active options - ALWAYS CALL THIS
  // const activeOptions = useMemo(
  //   () =>
  //     productOptions
  //       .filter(
  //         (o): o is ProductOption =>
  //           !!o && typeof o.title === "string" && Array.isArray(o.values)
  //       )
  //       .map((o) => ({ title: o.title.trim(), values: o.values }))
  //       .filter((o) => o.title && o.values.length),
  //   [productOptions]
  // );

  // // Generate variant rows - ALWAYS CALL THIS
  // const variantRows: VariantRow[] = useMemo(() => {
  //   if (!activeOptions.length) return [];

  //   const matrix = activeOptions.map((o) => o.values);
  //   const tuples = cartesian(matrix);

  //   return tuples.map((vals) => {
  //     const row: VariantRow = {};
  //     activeOptions.forEach((o, i) => {
  //       row[o.title] = vals[i];
  //     });
  //     return row;
  //   });
  // }, [activeOptions]);

  // Generate row key - memoized callback - ALWAYS CALL THIS
  // const getRowKey = useCallback((row: VariantRow) => {
  //   const entries = Object.entries(row)
  //     .filter(([key, value]) => key && value)
  //     .sort(([a], [b]) => a.localeCompare(b));
  //   return JSON.stringify(entries);
  // }, []);

  // Keep variant order in sync
  // useEffect(() => {
  //   const keys = variantRows.map((r) => getRowKey(r));
  //   setVariantOrder((prev) => {
  //     const existing = new Set(keys);
  //     const kept = prev.filter((k) => existing.has(k));
  //     const added = keys.filter((k) => !prev.includes(k));
  //     return [...kept, ...added];
  //   });
  // }, [variantRows, getRowKey]);

  if (!hasVariant) {
    return null;
  }

  // Only render the content conditionally, but all hooks have been called
  return (
    <div className="space-y-4">
      <div className="px-4 py-8 space-y-8">
        <VariantsAddOptions
          productOptions={productOptions}
          setProductOptions={setProductOptions}
        />
        <ProductVariants productOptions={productOptions} />
        {/* Product Variants */}

        {/* Info Tip */}
        <div className="mt-4 p-3 bg-blue-50 border-l-4 rounded-r-lg">
          <p className="text-sm">
            <span className="font-bold text-base">Tip: </span>
            <span className="text-sm text-gray-700">
              Variants left unchecked won't be created. You can always create
              and edit variants afterwards but this list fits the variations in
              your product options.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Variants;

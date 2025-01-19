declare const useAdd: (path: string) => {
    add: import("swr/mutation").TriggerWithArgs<any, any, string, Record<string, unknown>>;
    isAdding: boolean;
    data: any;
    error: any;
};
export default useAdd;

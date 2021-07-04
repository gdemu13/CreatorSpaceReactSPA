const buildFormData = (formData, data, parentKey) => {
    if (data && Array.isArray(data)) {
        for (let index = 0; index < data.length; index++) {
            buildFormData(formData, data[index], `${parentKey}[${index}]`);
        }
    } else if (
        data &&
        typeof data === 'object' &&
        !(data instanceof Date) &&
        !(data instanceof File)
    ) {
        Object.keys(data).forEach((key) => {
            buildFormData(
                formData,
                data[key],
                parentKey ? `${parentKey}.${key}` : key
            );
        });
    } else {
        const value = data == null ? '' : data;

        formData.append(parentKey, value);
    }
};

export const objTOFormData = (object) => {
    const formData = new FormData();
    buildFormData(formData, object);

    return formData;
};

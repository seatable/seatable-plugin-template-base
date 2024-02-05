export const truncateTableName = (tableName: string) => {
    let _tableName;

    if(tableName.split('').length > 22) {
        _tableName = tableName.slice(0, 20) + '...';

        return _tableName
    }

    return tableName
}
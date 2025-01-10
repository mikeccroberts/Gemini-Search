import { entityKind } from "../../entity.js";
import type { TypedQueryBuilder } from "../../query-builders/query-builder.js";
import type { SingleStoreDialectConfig } from "../dialect.js";
import { SingleStoreDialect } from "../dialect.js";
import type { WithSubqueryWithSelection } from "../subquery.js";
import type { ColumnsSelection } from "../../sql/sql.js";
import { WithSubquery } from "../../subquery.js";
import { SingleStoreSelectBuilder } from "./select.js";
import type { SelectedFields } from "./select.types.js";
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: SingleStoreDialect | SingleStoreDialectConfig);
    $with<TAlias extends string>(alias: TAlias): {
        as<TSelection extends ColumnsSelection>(qb: TypedQueryBuilder<TSelection> | ((qb: QueryBuilder) => TypedQueryBuilder<TSelection>)): WithSubqueryWithSelection<TSelection, TAlias>;
    };
    with(...queries: WithSubquery[]): {
        select: {
            (): SingleStoreSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
        };
        selectDistinct: {
            (): SingleStoreSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
        };
    };
    select(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
    selectDistinct(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
    private getDialect;
}

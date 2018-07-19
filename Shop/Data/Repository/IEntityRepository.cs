using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Shop.Services.Repository
{
    public interface IEntityRepository<TEntity> where TEntity : IEntity
    {
        TEntity FirstWhere(Expression<Func<TEntity, bool>> predicate);

        IEnumerable<TEntity> GetWhere(Expression<Func<TEntity, bool>> query);

        void Add(TEntity entity);

        void Update(TEntity entity);

        void DeleteWhere(Expression<Func<TEntity, bool>> predicate);

        void Delete(TEntity entity);

        void Revert(TEntity entity);
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Shop.Data;

namespace Shop.Services.Repository
{
    public class EntityRepository<TEntity> : IEntityRepository<TEntity> where TEntity : class, IEntity
    {
        private readonly DbContext dbContext;

        public EntityRepository(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public virtual IEnumerable<TEntity> GetWhere(Expression<Func<TEntity, bool>> query)
        {
            var entities = dbContext.Set<TEntity>().Where(query);
            return entities;
        }

        public virtual TEntity FirstWhere(Expression<Func<TEntity, bool>> predicate)
        {
            IQueryable<TEntity> query = dbContext.Set<TEntity>();
            return query.Where(predicate).FirstOrDefault();
        }

        public virtual void Add(TEntity entity)
        {
            dbContext.Set<TEntity>().Add(entity);
            dbContext.SaveChanges();
        }

        public virtual void Update(TEntity entity)
        {
            dbContext.Entry(entity).State = EntityState.Modified;
            dbContext.SaveChanges();
        }

        public virtual void DeleteWhere(Expression<Func<TEntity, bool>> predicate)
        {
            var entities = dbContext.Set<TEntity>().Where(predicate);
            foreach (var entity in entities)
            {
                dbContext.Entry(entity).State = EntityState.Deleted;
            }
            
            dbContext.SaveChanges();
        }

        public virtual void Delete(TEntity entity)
        {
            dbContext.Entry(entity).State = EntityState.Deleted;
            dbContext.SaveChanges();
        }

        public void Revert(TEntity entity)
        {
            var entry = dbContext.Entry(entity);

            if(entry != null)
                entry.State = EntityState.Unchanged;
        }
    }
}
import { Repository } from 'typeorm';

export abstract class CrudService<T> {
  /**
   * The TypeORM repository for the entity.
   */
  protected repo: Repository<T>;

  constructor(repo: Repository<T>) {
    this.repo = repo;
  }

  /**
   * Retrieve all entities from the database.
   */
  getManyBase() {
    return this.repo.find();
  }

  /**
   * Retrieve one entity by its ID from the database.
   * @param id The ID of the entity to retrieve.
   */
  getOneBase(id: string) {
    return this.repo.findOne({ where: { id } as any });
  }

  /**
   * Create a new entity in the database.
   * @param data The data to create the new entity with.
   */
  createOneBase(data: T) {
    return this.repo.save(data);
  }

  /**
   * Update an existing entity in the database.
   * @param id The ID of the entity to update.
   * @param data The updated data for the entity.
   */
  updateOneBase(id: string, data: T) {
    return this.repo.update({ id } as any, data as any);
  }

  /**
   * Delete an entity from the database.
   * @param id The ID of the entity to delete.
   */
  deleteOneBase(id: string) {
    return this.repo.delete({ id } as any);
  }

  /**
   * Delete multiple entities from the database.
   * @param ids The IDs of the entities to delete.
   */
  deleteManyBase(ids: string[]) {
    return this.repo.delete(ids);
  }

  /**
   * Soft delete an entity from the database.
   * @param id The ID of the entity to soft delete.
   */
  softDeleteOneBase(id: string) {
    return this.repo.softDelete({ id } as any);
  }

  /**
   * Soft delete multiple entities from the database.
   * @param ids The IDs of the entities to soft delete.
   */
  softDeleteManyBase(ids: string[]) {
    return this.repo.softDelete(ids);
  }

  /**
   * Restore a soft-deleted entity from the database.
   * @param id The ID of the entity to restore.
   */
  restoreOneBase(id: string) {
    return this.repo.restore({ id } as any);
  }

  /**
   * Restore multiple soft-deleted entities from the database.
   * @param ids The IDs of the entities to restore.
   */
  restoreManyBase(ids: string[]) {
    return this.repo.restore(ids);
  }
}

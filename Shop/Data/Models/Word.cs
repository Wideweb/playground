﻿using System.Collections.Generic;
using Shop.Services.Repository;

namespace Shop.Data.Models
{
    public class Word : IEntity
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public Language Language { get; set; }
        public ICollection<Translation> Translations { get; set; }
    }
}
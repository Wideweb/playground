using Shop.Models;
using System.Collections.Generic;

namespace Shop.Utils
{
    public static class DB
    {
        public static List<DictionaryItemView> Dictionary = new List<DictionaryItemView>() {
            new DictionaryItemView { Id = 1, Term = "Home", Translation = "Дом" },
            new DictionaryItemView { Id = 2, Term = "Head", Translation = "Голова" }
        };

        public static List<string> Words = new List<string> { "Дом", "Голова", "Корова", "Дым", "Слон", "Снег" };
    }
}

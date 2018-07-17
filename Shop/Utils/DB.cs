using Shop.Models;
using System.Collections.Generic;

namespace Shop.Utils
{
    public static class DB
    {
        public static List<DictionaryItemView> Dictionary = new List<DictionaryItemView>() {
            new DictionaryItemView { Id = 1, Term = "Home", Translation = "Дом" },
            new DictionaryItemView { Id = 2, Term = "Head", Translation = "Голова" },
            new DictionaryItemView { Id = 3, Term = "Island", Translation = "Остров" },
            new DictionaryItemView { Id = 4, Term = "Apple", Translation = "Яблоко" },
            new DictionaryItemView { Id = 5, Term = "Butter", Translation = "Масло" },
            new DictionaryItemView { Id = 6, Term = "Table", Translation = "Стол" },
            new DictionaryItemView { Id = 7, Term = "Success", Translation = "Успех" },
            new DictionaryItemView { Id = 8, Term = "Honey", Translation = "Мед" },
            new DictionaryItemView { Id = 8, Term = "Outskirts", Translation = "Окраина" }
        };

        public static List<string> Words = new List<string> { "Дом", "Голова", "Корова", "Дым", "Слон", "Снег", "Остров", "Яблоко", "Масло", "Стол", "Успех", "Мед", "Окраина" };
    }
}

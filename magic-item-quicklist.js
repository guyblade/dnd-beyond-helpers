// ==UserScript==
// @name         Magic Item Quicklist
// @namespace    https://www.blade.io/
// @version      0.2
// @description  Presents Magic Items & Monsters for each chapter in a drop-down for easy viewing
// @author       guyblade
// @updateURL    https://raw.githubusercontent.com/guyblade/dnd-beyond-helpers/master/magic-item-quicklist.js
// @match        https://www.dndbeyond.com/compendium/adventures/*
// @match        https://www.dndbeyond.com/sources/*
// @grant        none
// ==/UserScript==

let DedupAMap = function(map) {
    let reverse_map = new Map();
    map.forEach(function(t_value, key) {
      let value = $(t_value).attr("href");
      if (!reverse_map.has(value)) {
        reverse_map.set(value, []);
      }
      reverse_map.get(value).push(key);
    });
    reverse_map.forEach(function(value, key) {
      if (value.length == 1) {
        return;
      }
      let skipped_first = false;
      value.forEach(function(dup_key) {
        if (!skipped_first) {
          skipped_first = true;
          return;
        }
        map.delete(dup_key);
      });
    });
}

let GetBoxBySelector = function(selector) {
    let name_to_element = new Map();
    $(selector).each(function() {
        let x = $(this).clone(true);
        let name = x.text();
        name_to_element.set(name, x);
    });
    DedupAMap(name_to_element);
    let ordered_keys = Array.from(name_to_element.keys()).sort();
    console.log(ordered_keys);
    let box = $("<span style='background: white; display:inline-block; padding:3px'></span>");
    ordered_keys.forEach(function(key) {
        box.append(name_to_element.get(key));
        box.append($("<br>"));
    });
    return box;
}

let MagicItemBox = function() {
    return GetBoxBySelector("a.magic-item-tooltip");
};

let MonsterBox = function() {
    return GetBoxBySelector("a.monster-tooltip");
};

let GenToggleFunction = function(all_options, chosen, parent) {
  return function() {
      parent.empty();
      all_options.forEach(function(val, key) {
          if (key === chosen) {
              parent.append(val.clone());
          }
      });
  };
};

let ToggleBox = function(entries) {
    let keys = Array.from(entries.keys()).sort();
    let ret = $("<span style='display: inline-block; padding:3px; background:white'>");
    let switcher = $("<span>");
    let switchee = $("<span>");
    let first = true;
    keys.forEach(function(key) {
        let clicker = $("<span style='padding:5px'>");
        clicker.text(key);
        clicker.click(GenToggleFunction(entries, key, switchee));
        switcher.append(clicker);
        if (first) {
            clicker.click();
        }
        first = false;

    });
    ret.append(switcher);
    ret.append($("<br>"));
    ret.append(switchee);
    return ret;
};

(function() {
    let magic_items = MagicItemBox();
    let monsters = MonsterBox();
    let new_parent = $(".secondary-content");
    let mp = new Map();
    mp.set("I", magic_items);
    mp.set("M", monsters);
    new_parent.append(ToggleBox(mp));

})();


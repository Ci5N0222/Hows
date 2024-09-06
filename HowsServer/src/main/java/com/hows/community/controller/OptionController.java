package com.hows.community.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hows.community.dto.AreaSizeDTO;
import com.hows.community.dto.ColorDTO;
import com.hows.community.dto.HousingTypeDTO;
import com.hows.community.dto.SpaceTypeDTO;
import com.hows.community.service.OptionService;

@RestController
@RequestMapping("/option")
public class OptionController {
	@Autowired
	private OptionService optionServ;
	
	@GetMapping("/housing-types")
    public List<HousingTypeDTO> getHousingTypes() {
		System.out.println("요청확인");
        return optionServ.getHousingTypes();
    }
	
    @GetMapping("/space-types")
    public List<SpaceTypeDTO> getSpaceTypes() {
        return optionServ.getSpaceTypes();
    }

    @GetMapping("/colors")
    public List<ColorDTO> getColors() {
        return optionServ.getColors();
    }
    
    @GetMapping("/area-size")
    public List<AreaSizeDTO> getAreaSize() {
        return optionServ.getAreaSize();
    }
}
